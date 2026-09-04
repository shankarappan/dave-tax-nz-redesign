import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { articles } from "../src/articles.js";

const slug = "spinoff-overseas-student-loan-explainer";
const readPage = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), "utf8");

test("The Spinoff video is a dated archive record with Dave's guidance", async () => {
  const article = articles.find((item) => item.slug === slug);
  assert.ok(article);
  assert.equal(article.isoDate, "2026-09-02");
  assert.equal(article.publication, "The Spinoff");
  assert.match(article.contentHtml, /engage with Inland Revenue before you travel/);
  assert.match(article.contentHtml, /As published on 2 September 2026/);
  assert.equal(articles.filter((item) => item.slug === slug).length, 1);
});

test("The video is playable on its detail page through a privacy-enhanced embed", async () => {
  const html = await readPage(`articles-media/${slug}/index.html`);
  assert.match(html, /class="article-video-wrap article-video-wrap--portrait"/);
  assert.match(html, /youtube-nocookie\.com\/embed\/OhB5QYMllL4\?rel=0/);
  assert.match(html, /allowFullScreen=""/);
  assert.match(html, /View the original source/);

  const archive = await readPage("articles-media/index.html");
  const sitemap = await readPage("sitemap.xml");
  assert.ok(archive.includes(`/articles-media/${slug}/`));
  assert.ok(sitemap.includes(`https://davetaxnz.nz/articles-media/${slug}/`));
});

test("the existing Three News record uses the official player at Dave's segment", async () => {
  const article = articles.find((item) => item.slug === "three-news-student-loan-reform-dave-ananth");
  const html = await readPage("articles-media/three-news-student-loan-reform-dave-ananth/index.html");
  assert.match(article.videoEmbedUrl, /players\.brightcove\.net/);
  assert.match(article.videoEmbedUrl, /videoId=6404297244112&t=43/);
  assert.match(html, /Playback opens at 0:43; Dave Ananth’s segment concludes at 4:09/);
  assert.doesNotMatch(html, /class="article-featured/);
  assert.match(html, /View the original source/);
});
