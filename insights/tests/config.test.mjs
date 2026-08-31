import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "jsonc-parser";
test("shared JSONC configuration loads for the preview and remains private by default", async () => {
  const errors = [];
  const config = parse(
    await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
    errors,
    { allowTrailingComma: true },
  );
  assert.equal(errors.length, 0);
  assert.equal(config.vars.GA_PROPERTY_ID, "552154177");
  assert.match(config.vars.GA_COLLECTION_START, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(config.workers_dev, false);
  assert.equal(config.preview_urls, false);
  assert.equal(config.assets.run_worker_first, true);
  assert.deepEqual(config.routes, [
    { pattern: "insights.davetaxnz.nz", custom_domain: true },
  ]);
  assert.ok(config.secrets.required.includes("GOOGLE_SERVICE_ACCOUNT_JSON"));
  assert.ok(config.secrets.required.includes("ALLOWED_EMAILS"));
  assert.equal(config.vars.GOOGLE_SERVICE_ACCOUNT_JSON, undefined);
});
