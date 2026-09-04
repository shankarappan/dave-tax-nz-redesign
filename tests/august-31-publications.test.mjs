import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { articles } from "../src/articles.js";

const slugs = [
  "section-145a-overseas-student-loan-debt",
  "three-news-student-loan-reform-dave-ananth",
  "true-cost-of-family-labor-business-profitability",
];
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("31 August client publications appear once, newest first, in the archive and sitemap", async () => {
  assert.deepEqual(articles.filter(({ slug }) => slugs.includes(slug)).map(({ slug }) => slug), slugs);
  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");
  for (const slug of slugs) {
    assert.equal(articles.filter((article) => article.slug === slug).length, 1);
    assert.ok(archive.includes(`/articles-media/${slug}/`));
    assert.ok(sitemap.includes(`https://davetaxnz.nz/articles-media/${slug}/`));
  }
});

test("new details preserve supplied summaries, attribution, images and source links", async () => {
  for (const slug of slugs) {
    const article = articles.find((item) => item.slug === slug);
    const html = await readPage(`articles-media/${slug}/index.html`);
    assert.ok(html.includes(article.image));
    if (!article.videoEmbedUrl) {
      assert.ok(html.includes(`width="${article.imageWidth}" height="${article.imageHeight}"`));
    }
    assert.ok(html.includes(article.sourceUrl.replaceAll("&", "&amp;")));
    assert.match(html, /View the original source/);
    assert.match(html, /This is general information, not legal, tax or accounting advice/);
    assert.match(html, /property="og:type" content="article"/);
    assert.ok(html.includes(`https://davetaxnz.nz${article.image}`));
    const image = await stat(new URL(`../dist/client${article.image}`, import.meta.url));
    assert.ok(image.size > 10_000);
  }
  const interest = await readPage(`articles-media/${slugs[0]}/index.html`);
  assert.match(interest, /73,732 file referrals/);
  assert.match(interest, /not an automatic discount or amnesty/);
  assert.match(interest, /permanently resolve their historical debt/);
  const three = await readPage(`articles-media/${slugs[1]}/index.html`);
  assert.match(three, /0:43–4:09/);
  assert.match(three, /if re-elected/);
  assert.match(three, /counterproductive if it drives further disengagement/);
  const homeVoice = await readPage(`articles-media/${slugs[2]}/index.html`);
  assert.match(homeVoice, /article-featured--document/);
  assert.match(homeVoice, /honest valuation that buyers can trust/);
  assert.match(homeVoice, /Read PDF/);
  assert.match(homeVoice, /assets\/articles\/home-voice-family-labor-2026-08-28\.pdf/);
  assert.doesNotMatch(homeVoice, /Download the published PDF|Issue 1392|Issue 1389/);
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  assert.match(css, /\.article-featured--document\{max-height:none;object-fit:contain\}/);
});
