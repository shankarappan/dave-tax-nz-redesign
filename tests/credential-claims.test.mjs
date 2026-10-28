import assert from "node:assert/strict";
import test from "node:test";
import { articles } from "../src/articles.js";

test("Dave's byline copy states verified roles without unsupported rankings", () => {
  const article = articles.find(({ slug }) => slug === "i-live-in-australia-and-my-nz-student-loan-has-doubled-what-can-i-do");

  assert.ok(article);
  assert.match(article.contentHtml, /Tax Barrister and Partner at Meridian Partners/);
  assert.match(article.contentHtml, /former IRD Prosecutor/i);
  assert.doesNotMatch(article.contentHtml, /widely recognised as one of New Zealand’s leading authorities|number one|best student.loan lawyer|top student.loan lawyer/i);
});
