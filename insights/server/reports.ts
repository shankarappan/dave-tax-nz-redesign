import { importPKCS8, SignJWT } from "jose";
import { z } from "zod";

export type ReportConfig = {
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  GA_PROPERTY_ID: string;
  SEARCH_CONSOLE_SITE: string;
  GA_COLLECTION_START: string;
  SITE_CUTOVER_DATE: string;
};
export type Window = { start: string; end: string };
type Fetcher = typeof fetch;
const credentialSchema = z.object({
  client_email: z.string().email(),
  private_key: z.string().startsWith("-----BEGIN PRIVATE KEY-----"),
});
const metricValue = z.object({ value: z.string() });
const gaSchema = z.object({
  rows: z
    .array(
      z.object({
        dimensionValues: z.array(metricValue).optional(),
        metricValues: z.array(metricValue),
      }),
    )
    .optional(),
  rowCount: z.number().optional(),
  metadata: z
    .object({
      subjectToThresholding: z.boolean().optional(),
      dataLossFromOtherRow: z.boolean().optional(),
      samplingMetadatas: z.array(z.unknown()).optional(),
      timeZone: z.string().optional(),
    })
    .optional(),
});
const scSchema = z.object({
  rows: z
    .array(
      z.object({
        keys: z.array(z.string()).optional(),
        clicks: z.number(),
        impressions: z.number(),
        ctr: z.number(),
        position: z.number(),
      }),
    )
    .optional(),
});

export function nzDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((t) => parts.find((p) => p.type === t)?.value)
    .join("-");
}
export function shift(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function dateWindow(days: number, end: string): Window {
  return { start: shift(end, 1 - days), end };
}
export function parseRange(input: string | null) {
  if (!["7", "28", "90"].includes(input || "28"))
    throw new Error("Choose 7, 28 or 90 days.");
  return Number(input || 28);
}
export function percentageChange(current: number, previous: number | null) {
  return previous === null || previous === 0
    ? null
    : ((current - previous) / previous) * 100;
}

async function readJson(response: Response) {
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error("Reporting provider did not return a usable response.");
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Empty reporting response.");
  let text = "";
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000)
        throw new Error("Reporting response exceeds safe limit.");
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    await reader.cancel();
  }
  return JSON.parse(text + decoder.decode());
}
async function accessToken(config: ReportConfig, transport: Fetcher) {
  const account = credentialSchema.parse(
    JSON.parse(config.GOOGLE_SERVICE_ACCOUNT_JSON),
  );
  const key = await importPKCS8(account.private_key, "RS256");
  const jwt = await new SignJWT({
    scope:
      "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(account.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
  const response = await transport("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    signal: AbortSignal.timeout(12000),
  });
  return z.object({ access_token: z.string() }).parse(await readJson(response))
    .access_token;
}
async function limited<T>(
  tasks: (() => Promise<T>)[],
  concurrency = 3,
): Promise<T[]> {
  const results: T[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
      while (next < tasks.length) {
        const i = next++;
        results[i] = await tasks[i]();
      }
    }),
  );
  return results;
}
async function search(
  config: ReportConfig,
  token: string,
  days: number,
  today: string,
  transport: Fetcher,
) {
  // Search Console reports dates in Pacific time, not GA's Auckland timezone.
  // Three days' lag intentionally excludes provisional search data.
  const period = dateWindow(days, shift(today, -3));
  const previous = dateWindow(days, shift(period.start, -1));
  const dimensions = [
    [],
    [],
    ["date"],
    ["page"],
    ["query"],
    ["country"],
    ["device"],
  ];
  const results = await limited(
    dimensions.map((dims, index) => async () => {
      const range = index === 1 ? previous : period;
      const response = await transport(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.SEARCH_CONSOLE_SITE)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: range.start,
            endDate: range.end,
            dimensions: dims,
            type: "web",
            dataState: "final",
            rowLimit: 1000,
            dimensionFilterGroups: [
              {
                filters: [
                  {
                    dimension: "page",
                    operator: "includingRegex",
                    expression: "^https?://(www\\.)?davetaxnz\\.nz/",
                  },
                ],
              },
            ],
          }),
          signal: AbortSignal.timeout(12000),
        },
      );
      return scSchema.parse(await readJson(response)).rows || [];
    }),
  );
  return {
    status: "ready",
    period,
    previous,
    summary: results[0][0] || null,
    previousSummary: results[1][0] || null,
    daily: results[2],
    pages: results[3],
    queries: results[4],
    countries: results[5],
    devices: results[6],
    rowLimit: 1000,
    limited: results.some((r) => r.length >= 1000),
    timezone: "America/Los_Angeles",
  };
}
async function analytics(
  config: ReportConfig,
  token: string,
  days: number,
  today: string,
  transport: Fetcher,
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.GA_COLLECTION_START))
    return {
      status: "awaiting_installation",
      message:
        "The new Analytics property is connected. Collection will start when its tag is published.",
    };
  const requested = dateWindow(days, shift(today, -1));
  const period = {
    ...requested,
    start:
      requested.start > config.GA_COLLECTION_START
        ? requested.start
        : config.GA_COLLECTION_START,
  };
  if (period.start > period.end)
    return {
      status: "collecting",
      message:
        "Tracking has started. Completed-day reports will appear after Google processes the data.",
    };
  const previous = dateWindow(days, shift(requested.start, -1));
  const comparable = previous.start >= config.GA_COLLECTION_START;
  const specifications = [
    {
      key: "summary",
      dimensions: [],
      metrics: ["activeUsers", "sessions", "screenPageViews", "engagementRate"],
    },
    {
      key: "daily",
      dimensions: ["date"],
      metrics: ["activeUsers", "sessions", "screenPageViews"],
    },
    {
      key: "pages",
      dimensions: ["pagePath"],
      metrics: ["screenPageViews", "activeUsers", "userEngagementDuration"],
    },
    {
      key: "countries",
      dimensions: ["country"],
      metrics: ["activeUsers", "sessions"],
    },
    {
      key: "devices",
      dimensions: ["deviceCategory"],
      metrics: ["activeUsers", "sessions"],
    },
    {
      key: "channels",
      dimensions: ["sessionDefaultChannelGroup"],
      metrics: ["sessions"],
    },
    {
      key: "contacts",
      dimensions: ["eventName"],
      metrics: ["eventCount"],
      contact: true,
    },
    ...(comparable
      ? [
          {
            key: "previousSummary",
            dimensions: [],
            metrics: [
              "activeUsers",
              "sessions",
              "screenPageViews",
              "engagementRate",
            ],
            previous: true,
          },
        ]
      : []),
  ];
  const results = await limited(
    specifications.map((spec) => async () => {
      const range = "previous" in spec ? previous : period;
      const response = await transport(
        `https://analyticsdata.googleapis.com/v1beta/properties/${config.GA_PROPERTY_ID}:runReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: range.start, endDate: range.end }],
            dimensions: spec.dimensions.map((name) => ({ name })),
            metrics: spec.metrics.map((name) => ({ name })),
            limit: "1000",
            orderBys: [{ metric: { metricName: spec.metrics[0] }, desc: true }],
            ...("contact" in spec
              ? {
                  dimensionFilter: {
                    filter: {
                      fieldName: "eventName",
                      inListFilter: {
                        values: ["call_click", "email_click", "whatsapp_click"],
                      },
                    },
                  },
                }
              : {}),
          }),
          signal: AbortSignal.timeout(12000),
        },
      );
      const result = gaSchema.parse(await readJson(response));
      return {
        key: spec.key,
        rowCount: result.rowCount || 0,
        metadata: result.metadata,
        rows: (result.rows || []).map((row) => ({
          label: row.dimensionValues?.[0]?.value || "Total",
          ...Object.fromEntries(
            spec.metrics.map((name, i) => [
              name,
              Number(row.metricValues[i]?.value || 0),
            ]),
          ),
        })),
      };
    }),
  );
  return {
    status: "ready",
    period,
    requested,
    previous: comparable ? previous : null,
    collectionStart: config.GA_COLLECTION_START,
    partialPeriod: requested.start !== period.start,
    reports: Object.fromEntries(results.map((r) => [r.key, r.rows])),
    limited: results.some((r) => r.rowCount > 1000),
    thresholded: results.some((r) => r.metadata?.subjectToThresholding),
    sampled: results.some((r) => !!r.metadata?.samplingMetadatas?.length),
    timezone: "Pacific/Auckland",
  };
}
async function health(transport: Fetcher) {
  return limited(
    ["/", "/articles-media/", "/sitemap.xml", "/privacy/"].map(
      (path) => async () => {
        try {
          const response = await transport(`https://davetaxnz.nz${path}`, {
            method: "HEAD",
            redirect: "manual",
            signal: AbortSignal.timeout(8000),
          });
          return { path, status: response.status, ok: response.status === 200 };
        } catch {
          return { path, status: null, ok: false };
        }
      },
    ),
  );
}
export async function buildReport(
  config: ReportConfig,
  days: number,
  now = new Date(),
  transport: Fetcher = fetch,
) {
  if (
    !/^\d+$/.test(config.GA_PROPERTY_ID) ||
    config.SEARCH_CONSOLE_SITE !== "sc-domain:davetaxnz.nz"
  )
    throw new Error("Invalid reporting configuration.");
  const today = nzDate(now);
  const checks = health(transport);
  let token: string;
  try {
    token = await accessToken(config, transport);
  } catch {
    return {
      generatedAt: now.toISOString(),
      days,
      search: {
        status: "error",
        message:
          "Google authentication could not be completed. Ask the site administrator to check the reporting connection.",
      },
      analytics: {
        status: "error",
        message: "Google authentication could not be completed.",
      },
      health: await checks,
      cutoverDate: config.SITE_CUTOVER_DATE,
    };
  }
  const settled = await Promise.allSettled([
    search(config, token, days, today, transport),
    analytics(config, token, days, today, transport),
  ]);
  return {
    generatedAt: now.toISOString(),
    days,
    search:
      settled[0].status === "fulfilled"
        ? settled[0].value
        : {
            status: "error",
            message:
              "Search Console is temporarily unavailable. Existing data has not been removed.",
          },
    analytics:
      settled[1].status === "fulfilled"
        ? settled[1].value
        : {
            status: "error",
            message: "Analytics is temporarily unavailable. Try again later.",
          },
    health: await checks,
    cutoverDate: config.SITE_CUTOVER_DATE,
  };
}
