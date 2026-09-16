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

test("all podcasts appear before every non-podcast in the archive", async () => {
  const firstNonPodcast = archiveArticles.findIndex(({ type }) => type !== "Podcasts");
  const podcastCount = archiveArticles.filter(({ type }) => type === "Podcasts").length;
  assert.equal(firstNonPodcast, podcastCount);
  assert.ok(archiveArticles.slice(0, podcastCount).every(({ type }) => type === "Podcasts"));

  const archive = await readPage("articles-media/index.html");
  const podcastPositions = archiveArticles
    .filter(({ type }) => type === "Podcasts")
    .map(({ title }) => archive.indexOf(title));
  const firstStandardPosition = archive.indexOf(archiveArticles[podcastCount].title);
  assert.ok(podcastPositions.every((position) => position >= 0 && position < firstStandardPosition));
});
