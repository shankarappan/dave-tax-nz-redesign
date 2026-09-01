import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { articles } from "../src/articles.js";

const records = [
  ["safeguarding-your-legacy-protecting-the-business-youve-built", "home-voice-1389-safeguarding-your-legacy.jpg", 1240, 1755],
  ["mortgage-free-house-gold-coins-questions-at-ird", "home-voice-1390-mortgage-free-house-gold-coins.jpg", 1240, 1755],
  ["you-take-what-you-need-vegetable-boxes-tax-records", "home-voice-1391-vegetable-boxes-tax-records.jpg", 1240, 1755],
  ["true-cost-of-family-labor-business-profitability", "home-voice-family-labor-2026-08-28.jpg", 893, 1262],
];
const readPage = (slug) => readFile(new URL(`../dist/client/articles-media/${slug}/index.html`, import.meta.url), "utf8");

test("V.7 Chinese Home Voice records show complete publication scans and Read PDF links", async () => {
  for (const [slug, filename, width, height] of records) {
    const article = articles.find((item) => item.slug === slug);
    assert.equal(article.language, "Chinese");
    assert.ok(article.pdf);
    assert.equal(article.image, `/assets/articles/${filename}`);
    assert.equal(article.imageWidth, width);
    assert.equal(article.imageHeight, height);
    assert.equal(article.imagePresentation, "document");

    const html = await readPage(slug);
    assert.match(html, /article-featured article-featured--document/);
    assert.ok(html.includes(`src="/assets/articles/${filename}"`));
    assert.ok(html.includes(`width="${width}" height="${height}"`));
    assert.match(html, /<a class="button" href="\/assets\/articles\/home-voice-[^"]+\.pdf" target="_blank" rel="noopener noreferrer"><svg[^>]*>.*?<\/svg> Read PDF<\/a>/s);
    assert.doesNotMatch(html, /Download the published PDF| download(?:=|>)/);

    const image = await stat(new URL(`../dist/client/assets/articles/${filename}`, import.meta.url));
    assert.ok(image.size > 100_000);
    const pdf = await readFile(new URL(`../dist/client/assets/${article.pdf}`, import.meta.url));
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  }
});

test("future non-English PDF action remains data-driven", async () => {
  const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const articleSource = await readFile(new URL("../src/articles.js", import.meta.url), "utf8");
  assert.match(source, /article\.language !== "English"/);
  assert.match(source, /external=\{readPdf\}/);
  assert.match(source, /download=\{!readPdf/);
  assert.match(source, /Read PDF/);
  assert.match(articleSource, /Non-English article.*requires both its publication image and PDF/);
  for (const article of articles.filter((item) => item.language && item.language !== "English")) {
    assert.ok(article.image, `${article.slug} is missing its publication image`);
    assert.ok(article.pdf, `${article.slug} is missing its PDF`);
  }
});

test("new family-labour PDF is the supplied one-page inert publication file", async () => {
  const file = await readFile(new URL("../public/assets/articles/home-voice-family-labor-2026-08-28.pdf", import.meta.url));
  assert.equal(file.subarray(0, 5).toString(), "%PDF-");
  assert.equal(file.length, 377_292);
  const text = file.toString("latin1");
  assert.doesNotMatch(text, /\/JavaScript|\/JS\b|\/AcroForm|\/Encrypt/);
});
