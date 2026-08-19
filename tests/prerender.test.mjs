import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("initial HTML contains substantive production content", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /Student Loan Lawyer NZ and IRD Negotiator/);
  assert.match(html, /Selected IRD tax-debt matters/);
  assert.match(html, /tel:\+642102168888/);
  assert.match(html, /wa\.me\/642102168888/);
  assert.match(html, /index, follow/);
  assert.match(html, /https:\/\/davetaxnz\.nz\//);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /shankarappan\.github\.io/);
  assert.doesNotMatch(html, /shankarappan\.chatgpt\.site/);
});

test("archive and privacy are separately prerendered", async () => {
  const archive = await readFile(new URL("../dist/client/articles-media/index.html", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../dist/client/privacy/index.html", import.meta.url), "utf8");
  assert.match(archive, /All subjects/);
  assert.match(archive, /All types/);
  assert.match(privacy, /New Zealand Privacy Act 2020/);
  assert.doesNotMatch(privacy, /staging|client confirmation|required before launch/i);
});

test("production discovery files and legacy redirects are emitted", async () => {
  const robots = await readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  const booking = await readFile(new URL("../dist/client/book-a-consultation/index.html", import.meta.url), "utf8");
  const legacyArticle = await readFile(new URL("../dist/client/2026/07/28/overseas-student-loan-default-deal/index.html", import.meta.url), "utf8");
  assert.match(robots, /Allow: \//);
  assert.match(robots, /https:\/\/davetaxnz\.nz\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/davetaxnz\.nz\/articles-media\//);
  assert.match(booking, /https:\/\/davetaxnz\.nz\/#contact/);
  assert.match(legacyArticle, /\/articles-media\/overseas-student-loan-default-deal\//);
});
