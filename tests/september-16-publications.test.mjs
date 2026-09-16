import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { articles } from "../src/articles.js";

const slugs = [
  "expats-owing-student-debt-higher-risk-arrest",
  "student-loan-arrest-warrants-new-tax-bill",
];
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("16 September client publications appear once and newest first", async () => {
  assert.deepEqual(articles.slice(0, 2).map(({ slug }) => slug), slugs);
  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");
  for (const slug of slugs) {
    assert.equal(articles.filter((article) => article.slug === slug).length, 1);
    assert.ok(archive.includes(`/articles-media/${slug}/`));
    assert.ok(sitemap.includes(`https://davetaxnz.nz/articles-media/${slug}/`));
  }
});

test("new details preserve the supplied summaries, images and source links", async () => {
  for (const slug of slugs) {
    const article = articles.find((item) => item.slug === slug);
    const html = await readPage(`articles-media/${slug}/index.html`);
    assert.ok(html.includes(article.image));
    assert.ok(html.includes(`width="${article.imageWidth}" height="${article.imageHeight}"`));
    assert.ok(html.includes(article.sourceUrl.replaceAll("&", "&amp;")));
    assert.match(html, /Article summary/);
    assert.match(html, /View the original source/);
    const image = await stat(new URL(`../dist/client${article.image}`, import.meta.url));
    assert.ok(image.size > 10_000);
  }

  const newsroom = await readPage(`articles-media/${slugs[0]}/index.html`);
  assert.match(newsroom, /\$4\.5 billion of total student loan debt/);
  assert.match(newsroom, /compliance sitting at just 32\.1%/);
  assert.match(newsroom, /put their heads in the sand/);

  const interest = await readPage(`articles-media/${slugs[1]}/index.html`);
  assert.match(interest, /does not expressly require deliberate avoidance to be proved/);
  assert.match(interest, /Opinion article written by Dave Ananth/);
});
