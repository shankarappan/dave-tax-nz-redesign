import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

import { articles } from "../src/articles.js";

const returningSlug = "returning-new-zealand-old-student-loan-five-things";
const rnzSlug = "labours-583m-student-debt-deal-australian-pay";
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("27 September return-to-New-Zealand article is complete", async () => {
  const article = articles.find(({ slug }) => slug === returningSlug);

  assert.ok(article);
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

test("29 September Newsroom report has its correct author, date and original URL", async () => {
  const article = articles.find(({ slug }) => slug === "labours-583m-student-debt-deal-australian-pay");

  assert.ok(article);
  assert.equal(article.title, "Labour’s $583m student debt deal fails to blunt lure of Australian pay");
  assert.equal(article.publication, "Newsroom");
  assert.equal(article.author, "Alice Peacock");
  assert.equal(article.date, "29 September 2026");
  assert.equal(article.isoDate, "2026-09-29");
  assert.equal(article.relationship, "Written Newsroom coverage featuring Dave Ananth’s comments");
  assert.match(article.contentHtml, /\$583\.4 million initiative/);
  assert.match(article.contentHtml, /Dave Ananth/);
  assert.doesNotMatch(article.contentHtml, /Sue Bradford|David Farrar|Panellists/);
  assert.equal(article.sourceUrl, "https://newsroom.co.nz/2026/09/29/labours-583m-student-debt-deal-fails-to-blunt-lure-of-australian-pay/");
  assert.equal(articles.filter(({ sourceUrl }) => sourceUrl === article.sourceUrl).length, 1);

  const html = await readPage(`articles-media/${article.slug}/index.html`);
  assert.match(html, /Labour’s \$583m student debt deal/);
  assert.match(html, /Newsroom/);
  assert.match(html, /Written Newsroom coverage featuring Dave Ananth’s comments/);
  assert.match(html, /newsroom\.co\.nz\/2026\/09\/29\/labours-583m-student-debt-deal-fails-to-blunt-lure-of-australian-pay/);
});

test("both 29 September client additions appear once in the archive and sitemap", async () => {
  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");

  assert.equal((archive.match(new RegExp(returningSlug, "g")) ?? []).length, 1);
  assert.equal((archive.match(new RegExp(rnzSlug, "g")) ?? []).length, 1);
  assert.match(sitemap, new RegExp(`articles-media/${returningSlug}/`));
  assert.match(sitemap, new RegExp(`articles-media/${rnzSlug}/`));
});
