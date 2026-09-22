import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { archiveArticles, articles } from "../src/articles.js";

const slug = "the-panel-sue-bradford-david-farrar-dave-ananth";
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("RNZ The Panel entry includes the supplied metadata, summary, link and image", async () => {
  const article = articles.find((item) => item.slug === slug);
  assert.ok(article);
  assert.equal(article.date, "17 September 2026");
  assert.equal(article.type, "Podcasts");
  assert.equal(article.publication, "RNZ · The Panel");
  assert.match(article.relationship, /Sue Bradford and David Farrar/);
  assert.match(article.contentHtml, /audio segment \(33:30–40:15\)/);
  assert.match(article.contentHtml, /compounding interest and outdated contact details/);
  assert.match(article.sourceUrl, /rnz\.co\.nz\/national\/programmes\/thepanel\/audio\/2019052346/);

  const html = await readPage(`articles-media/${slug}/index.html`);
  assert.match(html, /The Panel with Sue Bradford and David Farrar/);
  assert.match(html, /Sue Bradford and David Farrar/);
  assert.match(html, /audio segment \(33:30–40:15\)/);
  assert.match(html, /rnz-the-panel-student-loan-2026-09-17\.png/);
  assert.match(html, /View the original source/);

  const image = await stat(new URL("../dist/client/assets/articles/rnz-the-panel-student-loan-2026-09-17.png", import.meta.url));
  assert.ok(image.size > 10_000);
});

test("the new RNZ podcast leads the podcast-first archive", async () => {
  assert.equal(archiveArticles[0].slug, slug);
  const archive = await readPage("articles-media/index.html");
  const rnzPosition = archive.indexOf("The Panel with Sue Bradford and David Farrar");
  const priorPodcastPosition = archive.indexOf("Student Loan Arrest Warrants and Airport Enforcement");
  const newestNonPodcastPosition = archive.indexOf("Expats Owing Student Debt Face");
  assert.ok(rnzPosition >= 0 && rnzPosition < priorPodcastPosition);
  assert.ok(priorPodcastPosition < newestNonPodcastPosition);
});

test("Three News image-only media schema contains no VideoObject", async () => {
  const html = await readPage("articles-media/three-news-student-loan-reform-dave-ananth/index.html");
  assert.doesNotMatch(html, /VideoObject/);
  assert.match(html, /three-news-student-loan-reform-2026-08-30-v9\.png/);
});
