import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, exportPKCS8 } from "jose";
import {
  buildReport,
  nzDate,
  shift,
  dateWindow,
  parseRange,
  percentageChange,
} from "../server/reports.ts";
import { csvText, articleRows, safeSitePath } from "../src/format.js";
const { privateKey } = await generateKeyPair("RS256", { extractable: true });
const config = {
  GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({
    client_email: "test@example.com",
    private_key: await exportPKCS8(privateKey),
  }),
  GA_PROPERTY_ID: "123",
  SEARCH_CONSOLE_SITE: "sc-domain:davetaxnz.nz",
  GA_COLLECTION_START: "",
  SITE_CUTOVER_DATE: "2026-08-20",
};
const today = new Date("2026-08-31T02:00:00Z");
function mock(options = {}) {
  const calls = [];
  let inflight = 0;
  let maximum = 0;
  const transport = async (input, init) => {
    const url = String(input);
    const body =
      init?.body instanceof URLSearchParams
        ? null
        : init?.body
          ? JSON.parse(init.body)
          : null;
    calls.push({ url, body, method: init?.method });
    inflight++;
    maximum = Math.max(maximum, inflight);
    await new Promise((r) => setTimeout(r, 1));
    inflight--;
    if (url === "https://oauth2.googleapis.com/token")
      return options.authError
        ? new Response("no", { status: 401 })
        : Response.json({ access_token: "test-token" });
    if (url.startsWith("https://davetaxnz.nz/"))
      return new Response(null, { status: 200 });
    if (url.startsWith("https://searchconsole.googleapis.com/"))
      return options.searchError
        ? new Response("no", { status: 503 })
        : Response.json({ rows: [] });
    if (url.startsWith("https://analyticsdata.googleapis.com/"))
      return Response.json({
        rows: [],
        metadata: { timeZone: "Pacific/Auckland" },
      });
    throw new Error("Unexpected network target");
  };
  return {
    transport,
    calls,
    get maximum() {
      return maximum;
    },
  };
}
test("calendar ranges survive NZ midnight and DST without shifting reporting dates", () => {
  assert.equal(nzDate(new Date("2026-08-30T13:00:00Z")), "2026-08-31");
  assert.equal(shift("2026-09-28", -1), "2026-09-27");
  assert.deepEqual(dateWindow(7, "2026-09-01"), {
    start: "2026-08-26",
    end: "2026-09-01",
  });
  assert.equal(parseRange(null), 28);
  assert.throws(() => parseRange("10000"));
  assert.equal(percentageChange(10, 0), null);
  assert.equal(percentageChange(10, null), null);
});
test("search is final-data, fixed-domain and capped; uninstalled Analytics is not fabricated", async () => {
  const m = mock();
  const result = await buildReport(config, 28, today, m.transport);
  assert.equal(result.search.status, "ready");
  assert.equal(result.search.summary, null);
  assert.equal(result.analytics.status, "awaiting_installation");
  assert.equal(
    m.calls.filter((c) => c.url.includes("analyticsdata")).length,
    0,
  );
  for (const call of m.calls.filter((c) => c.url.includes("searchconsole"))) {
    assert.equal(call.body.dataState, "final");
    assert.equal(call.body.rowLimit, 1000);
    assert.equal(
      call.body.dimensionFilterGroups[0].filters[0].operator,
      "includingRegex",
    );
    const filter = new RegExp(
      call.body.dimensionFilterGroups[0].filters[0].expression,
    );
    assert.equal(filter.test("https://davetaxnz.nz/articles/"), true);
    assert.equal(filter.test("https://wordpress-admin.davetaxnz.nz/"), false);
    assert.equal(filter.test("https://davetaxnzXnz/"), false);
  }
  assert.ok(m.maximum <= 6);
});
test("GA starts at collection date and cannot imply a full prior baseline", async () => {
  const m = mock();
  const result = await buildReport(
    { ...config, GA_COLLECTION_START: "2026-08-25" },
    28,
    today,
    m.transport,
  );
  assert.equal(result.analytics.status, "ready");
  assert.equal(result.analytics.period.start, "2026-08-25");
  assert.equal(result.analytics.partialPeriod, true);
  assert.equal(result.analytics.previous, null);
  assert.equal(result.analytics.reports.previousSummary, undefined);
  const contact = m.calls.find((c) =>
    c.body?.dimensions?.some((d) => d.name === "eventName"),
  );
  assert.deepEqual(contact.body.dimensionFilter.filter.inListFilter.values, [
    "call_click",
    "email_click",
    "whatsapp_click",
  ]);
});
test("provider errors stay errors and do not become zero traffic", async () => {
  const result = await buildReport(
    config,
    28,
    today,
    mock({ searchError: true }).transport,
  );
  assert.equal(result.search.status, "error");
  assert.equal(result.search.summary, undefined);
  assert.equal(result.analytics.status, "awaiting_installation");
  const auth = await buildReport(
    config,
    28,
    today,
    mock({ authError: true }).transport,
  );
  assert.equal(auth.search.status, "error");
  assert.equal(auth.analytics.status, "error");
});
test("article matching combines www variants but does not invent absent metrics", () => {
  const rows = articleRows(
    [{ path: "/articles-media/a/" }, { path: "/articles-media/b/" }],
    [
      {
        keys: ["https://davetaxnz.nz/articles-media/a/"],
        clicks: 2,
        impressions: 8,
      },
      {
        keys: ["https://www.davetaxnz.nz/articles-media/a"],
        clicks: 3,
        impressions: 9,
      },
    ],
    [],
  );
  assert.equal(rows[0].clicks, 5);
  assert.equal(rows[0].impressions, 17);
  assert.equal(rows[0].views, null);
  assert.equal(rows[1].clicks, null);
  assert.equal(safeSitePath("https://evil.test/x"), null);
  assert.equal(safeSitePath("javascript:alert(1)"), null);
});
test("CSV export quotes content and neutralises spreadsheet formula injection", () => {
  const csv = csvText(
    [{ key: "title", label: "Title" }],
    [
      { title: '=HYPERLINK("evil")' },
      { title: "  +formula" },
      { title: "Normal, title" },
    ],
  );
  assert.ok(csv.includes('"\'=HYPERLINK(""evil"")"'));
  assert.ok(csv.includes('"\'  +formula"'));
  assert.ok(csv.includes('"Normal, title"'));
});
