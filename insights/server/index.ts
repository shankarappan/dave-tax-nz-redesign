import { AccessError, authorize } from "./auth.ts";
import { buildReport, parseRange, nzDate } from "./reports.ts";

const security = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Strict-Transport-Security": "max-age=86400",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
};
function secure(response: Response) {
  const copy = new Response(response.body, response);
  Object.entries(security).forEach(([key, value]) =>
    copy.headers.set(key, value),
  );
  return copy;
}
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      if (url.origin !== env.DASHBOARD_ORIGIN)
        return secure(new Response("Unknown reporting host.", { status: 404 }));
      await authorize(request, env);
      if (request.method !== "GET" && request.method !== "HEAD")
        return secure(
          new Response("Read-only reporting.", {
            status: 405,
            headers: { Allow: "GET, HEAD" },
          }),
        );
      if (url.pathname === "/api/report") {
        if (request.method !== "GET")
          return secure(new Response(null, { status: 405 }));
        let days: number;
        try {
          days = parseRange(url.searchParams.get("days"));
        } catch {
          return secure(
            Response.json(
              { error: "Choose 7, 28 or 90 days." },
              { status: 400 },
            ),
          );
        }
        // Authentication precedes every cache lookup. Never cache an anonymous response.
        const key = new Request(
          `${env.DASHBOARD_ORIGIN}/__private_cache/v1/${env.GA_PROPERTY_ID}/${env.GA_COLLECTION_START || "pending"}/${nzDate()}/${days}`,
        );
        const cache = await caches.open("owner-reports");
        const cached = await cache.match(key);
        if (cached) return secure(cached);
        const report = await buildReport(env, days);
        const response = Response.json(report);
        if (
          report.search.status !== "error" &&
          report.analytics.status !== "error"
        ) {
          const stored = new Response(response.clone().body, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=3600",
            },
          });
          ctx.waitUntil(cache.put(key, stored));
        }
        return secure(response);
      }
      if (
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/__private_cache/")
      )
        return secure(new Response("Not found.", { status: 404 }));
      return secure(await env.ASSETS.fetch(request));
    } catch (error) {
      // Log no tokens, identities, queries, raw Google responses or credential contents.
      const status = error instanceof AccessError ? error.status : 503;
      return secure(
        new Response(
          status === 503
            ? "Private reporting is not configured yet. Please contact the site administrator."
            : "Sign in with an authorised owner account to view this report.",
          { status },
        ),
      );
    }
  },
} satisfies ExportedHandler<Env>;
