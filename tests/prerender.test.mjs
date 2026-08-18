import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("initial HTML contains substantive content and staging safeguards", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /Student Loan Lawyer NZ and IRD Negotiator/);
  assert.match(html, /Selected IRD tax-debt matters/);
  assert.match(html, /tel:\+642102168888/);
  assert.match(html, /wa\.me\/642102168888/);
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /shankarappan\.github\.io/);
});

test("archive and privacy are separately prerendered", async () => {
  const archive = await readFile(new URL("../dist/client/articles-media/index.html", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../dist/client/privacy/index.html", import.meta.url), "utf8");
  assert.match(archive, /All subjects/);
  assert.match(archive, /All types/);
  assert.match(privacy, /New Zealand Privacy Act 2020/);
});
