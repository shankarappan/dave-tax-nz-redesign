import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createServer as createViteServer } from "vite";
import { buildReport, parseRange } from "../server/reports.ts";
import "./catalog.mjs";

// Development-only adapter. Not imported by the Worker and never listens publicly.
const port = 4178;
const origin = `http://127.0.0.1:${port}`;
const vite = await createViteServer({
  server: { middlewareMode: true, hmr: false },
  appType: "spa",
});
const config = {
  GOOGLE_SERVICE_ACCOUNT_JSON: await readFile(
    new URL(
      "../../../.private-davetax-reporting/google-service-account.json",
      import.meta.url,
    ),
    "utf8",
  ),
  GA_PROPERTY_ID: "552154177",
  SEARCH_CONSOLE_SITE: "sc-domain:davetaxnz.nz",
  GA_COLLECTION_START: "",
  SITE_CUTOVER_DATE: "2026-08-20",
};
const cache = new Map();
createServer(async (req, res) => {
  if (
    req.headers.host !== `127.0.0.1:${port}` ||
    (req.headers.origin && req.headers.origin !== origin) ||
    (req.headers["sec-fetch-site"] &&
      !["none", "same-origin"].includes(req.headers["sec-fetch-site"]))
  ) {
    res.writeHead(403);
    res.end("Local preview only.");
    return;
  }
  if (req.url?.startsWith("/api/report")) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "GET") {
      res.writeHead(405);
      res.end("{}");
      return;
    }
    try {
      const days = parseRange(
        new URL(req.url, origin).searchParams.get("days"),
      );
      const saved = cache.get(days);
      const report =
        saved && Date.now() - saved.time < 3600000
          ? saved.report
          : await buildReport(config, days);
      if (report.search.status !== "error")
        cache.set(days, { report, time: Date.now() });
      res.end(JSON.stringify({ ...report, preview: true }));
    } catch {
      res.writeHead(503);
      res.end(
        JSON.stringify({ error: "Local reporting connection unavailable." }),
      );
    }
    return;
  }
  vite.middlewares(req, res);
}).listen(port, "127.0.0.1", () =>
  console.log(
    `Private local preview: ${origin} (no production sign-in bypass)`,
  ),
);
