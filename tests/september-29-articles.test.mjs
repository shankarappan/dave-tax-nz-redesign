import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

import { articles } from "../src/articles.js";

const returningSlug = "returning-new-zealand-old-student-loan-five-things";
const rnzSlug = "labours-583m-student-debt-deal-australian-pay";
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("27 September return-to-New-Zealand article is complete and newest", async () => {
  const article = articles.find(({ slug }) => slug === returningSlug);

  assert.ok(article);
  assert.equal(articles[0].slug, returningSlug);
  assert.equal(article.author, "Dave Ananth");
  assert.equal(article.date, "27 September 2026");
  assert.equal(article.type, "Articles by Dave");
  assert.match(article.contentHtml, /Before you book your flight, do these five things\./);
  assert.match(article.contentHtml, /1\. Get the full loan history\./);
  assert.match(article.contentHtml, /5\. Get the position assessed before travelling\./);
  assert.match(article.contentHtml, /no lawyer can guarantee an airport outcome/);

  const html = await readPage(`articles-media/${returningSlug}/index.html`);
  assert.match(html, /returning-new-zealand-old-student-loan-2026-09-27\.jpg/);
  assert.match(html, /contact Dave Ananth/);
  assert.doesNotMatch(html, /View the original source/);

  const image = await stat(
    new URL(
      "../dist/client/assets/articles/returning-new-zealand-old-student-loan-2026-09-27.jpg",
      import.meta.url,
    ),
  );
  assert.ok(image.size > 100_000);
});

test("17 September RNZ policy discussion includes the supplied summary and source", async () => {
  const article = articles.find(({ slug }) => slug === rnzSlug);

  assert.ok(article);
  assert.equal(article.title, "Labour’s $583m student debt deal fails to blunt lure of Australian pay");
  assert.equal(article.publication, "RNZ · The Panel");
  assert.equal(article.date, "17 September 2026");
  assert.match(article.relationship, /Sue Bradford and David Farrar/);
  assert.match(article.contentHtml, /\$583\.4 million initiative/);
  assert.match(article.contentHtml, /\$2\.49 billion in overdue student debt/);
  assert.match(article.contentHtml, /pragmatic, commercial, case-by-case approach/);
  assert.match(article.sourceUrl, /rnz\.co\.nz\/national\/programmes\/thepanel\/audio\/2019052346/);

  const html = await readPage(`articles-media/${rnzSlug}/index.html`);
  assert.match(html, /Labour’s \$583m student debt deal/);
  assert.match(html, /View the original source/);
  assert.match(html, /The Panel discussion quoting Dave Ananth/);
});

test("both 29 September client additions appear once in the archive and sitemap", async () => {
  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");

  assert.equal((archive.match(new RegExp(returningSlug, "g")) ?? []).length, 1);
  assert.equal((archive.match(new RegExp(rnzSlug, "g")) ?? []).length, 1);
  assert.match(sitemap, new RegExp(`articles-media/${returningSlug}/`));
  assert.match(sitemap, new RegExp(`articles-media/${rnzSlug}/`));
});
