import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { articles } from "../src/articles.js";

const newsSlug = "rnz-little-known-discounts-overdue-student-loans";
const interviewSlug = "rnz-nine-to-noon-big-discounts-overdue-student-loans";
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("28 October RNZ news coverage and Nine to Noon audio remain distinct", () => {
  const news = articles.find(({ slug }) => slug === newsSlug);
  const interview = articles.find(({ slug }) => slug === interviewSlug);

  assert.ok(news);
  assert.ok(interview);
  assert.equal(news.title, "The little known discounts you can get on overdue student loans");
  assert.equal(news.date, "28 October 2026");
  assert.equal(news.isoDate, "2026-10-28");
  assert.equal(news.type, "Media Coverage");
  assert.equal(news.publication, "RNZ Business");
  assert.equal(news.author, "Nine to Noon");
  assert.equal(news.relationship, "RNZ written coverage featuring Dave Ananth; Dave is not the author");
  assert.equal(news.sourceUrl, "https://www.rnz.co.nz/news/business/2201439/the-little-known-discounts-you-can-get-on-overdue-student-loans");

  assert.equal(interview.title, "Big discounts possible for overdue student loan borrowers");
  assert.equal(interview.date, "28 October 2026");
  assert.equal(interview.isoDate, "2026-10-28");
  assert.equal(interview.type, "Media Interviews");
  assert.equal(interview.publication, "RNZ · Nine to Noon");
  assert.equal(interview.author, "RNZ");
  assert.equal(interview.relationship, "Nine to Noon radio interview with Dave Ananth");
  assert.equal(interview.summary, "Dave Ananth speaks to RNZ Nine to Noon about overdue New Zealand student loans and overseas-based borrowers, including the April law change giving the Inland Revenue Commissioner power to provide interest relief and existing powers to reduce penalties.");
  assert.equal(interview.sourceUrl, "https://www.rnz.co.nz/national/programmes/ninetonoon/audio/2019057608/big-discounts-possible-for-overdue-student-loan-borrowers");
  assert.notEqual(news.sourceUrl, interview.sourceUrl);
  assert.equal(news.contentHtml, undefined);
  assert.equal(interview.contentHtml, undefined);
});

test("both RNZ source links appear separately in the DaveTax archive and sitemap", async () => {
  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");

  for (const article of articles.filter(({ slug }) => [newsSlug, interviewSlug].includes(slug))) {
    const html = await readPage(`articles-media/${article.slug}/index.html`);
    assert.ok(archive.includes(article.sourceUrl));
    assert.ok(archive.includes(article.title));
    assert.ok(html.includes(article.title));
    assert.ok(html.includes(article.sourceUrl));
    assert.ok(sitemap.includes(`/articles-media/${article.slug}/`));
  }
  assert.equal((archive.match(new RegExp(newsSlug, "g")) ?? []).length, 1);
  assert.equal((archive.match(new RegExp(interviewSlug, "g")) ?? []).length, 1);
});
