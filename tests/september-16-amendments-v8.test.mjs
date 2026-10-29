import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { archiveArticles, articles } from "../src/articles.js";

const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("border-arrest article links its consultation URL", async () => {
  const article = articles.find(({ slug }) => slug === "can-ird-arrest-me-at-the-border-over-my-student-loan");
  assert.match(article.contentHtml, /href="\/book-a-consultation\/">davetaxnz\.nz\/book-a-consultation<\/a>/);

  const html = await readPage("articles-media/can-ird-arrest-me-at-the-border-over-my-student-loan/index.html");
  assert.match(html, /href="\/book-a-consultation\/">davetaxnz\.nz\/book-a-consultation<\/a>/);
});

test("requested podcast pages link Related information to DaveTax contact", async () => {
  const slugs = [
    "three-news-student-loan-reform-dave-ananth",
    "student-loan-airport-arrest-warrants",
  ];

  for (const slug of slugs) {
    const article = articles.find((item) => item.slug === slug);
    assert.match(article.contentHtml, /href="\/#contact">Contact Dave<\/a>/);
    assert.doesNotMatch(article.contentHtml, />Contact Meridian Partners<\/a>/);

    const outputPath = slug === "student-loan-airport-arrest-warrants"
      ? "student-loan-airport-arrest-warrants/index.html"
      : `articles-media/${slug}/index.html`;
    const html = await readPage(outputPath);
    assert.match(html, /href="\/#contact">Contact Dave<\/a>/);
  }
});

test("archive orders all publication types by original date", async () => {
  for (let i = 1; i < archiveArticles.length; i++) {
    assert.ok(archiveArticles[i - 1].isoDate >= archiveArticles[i].isoDate);
  }
  const archive = await readPage("articles-media/index.html");
  const dates = [...archive.matchAll(/<time dateTime="([^"]+)"/g)].map(match => match[1]);
  assert.ok(dates.length > 30);
  assert.equal(dates[0], "2026-10-28");
  for (let i = 1; i < dates.length; i++) assert.ok(dates[i - 1] >= dates[i]);
});
