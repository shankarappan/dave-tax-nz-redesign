import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("initial HTML contains substantive production content", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /Student Loan Lawyer NZ and IRD Negotiator/);
  assert.match(html, /Student Loan Debt &amp; Penalties/);
  assert.match(html, /Tax Disputes &amp; IRD Negotiation/);
  assert.match(html, /IRD tax-debt advice and negotiation/);
  assert.match(html, /Read more testimonials/);
  assert.doesNotMatch(html, /Principal specialist practice/);
  assert.match(html, /tel:\+642102168888/);
  assert.match(html, /wa\.me\/642102168888/);
  assert.match(html, /index, follow/);
  assert.match(html, /https:\/\/davetaxnz\.nz\//);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /shankarappan\.github\.io/);
  assert.doesNotMatch(html, /shankarappan\.chatgpt\.site/);
});

test("archive and privacy are separately prerendered", async () => {
  const archive = await readFile(new URL("../dist/client/articles-media/index.html", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../dist/client/privacy/index.html", import.meta.url), "utf8");
  assert.match(archive, /All subjects/);
  assert.match(archive, /All types/);
  assert.match(privacy, /New Zealand Privacy Act 2020/);
  assert.doesNotMatch(privacy, /staging|client confirmation|required before launch/i);
});

test("complete testimonial archive is prerendered with inline disclosure controls", async () => {
  const html = await readFile(new URL("../dist/client/testimonials/index.html", import.meta.url), "utf8");
  assert.equal((html.match(/class="testimonial-card"/g) ?? []).length, 39);
  assert.match(html, /Chelsea Bernal/);
  assert.match(html, /Fenella Hodgkinson/);
  assert.match(html, /aria-controls="testimonial-0"/);
  assert.match(html, /Some reviews were originally published while Dave was at Stace Hammond/);
  assert.match(html, /No outcome or timeframe can be guaranteed/);
});

test("client-approved article corrections are preserved", async () => {
  const externalSlugs = [
    "rnz-half-a-million-people-owe-tax",
    "rnz-overdue-tax",
    "interest-overseas-student-loans",
  ];
  for (const slug of externalSlugs) {
    const html = await readFile(new URL(`../dist/client/articles-media/${slug}/index.html`, import.meta.url), "utf8");
    assert.match(html, /View the original source/);
    assert.doesNotMatch(html, /Migrated from the original DaveTaxNZ publication archive/);
  }

  const noFeaturedImageSlugs = [
    "nz-crypto-tax-disposals",
    "overseas-student-loan-default-deal",
    "ird-statutory-demand-critical-10-day-guide",
    "student-loan-border-arrest",
    "gst-as-working-capital-critical-ird-fix",
    "tax-debt-enforcement-timing",
    "ird-tax-debt-commercial-judgment",
    "ird-tax-debt-negotiation-beats-liquidation",
  ];
  for (const slug of noFeaturedImageSlugs) {
    const html = await readFile(new URL(`../dist/client/articles-media/${slug}/index.html`, import.meta.url), "utf8");
    assert.doesNotMatch(html, /class="article-featured"/);
  }

  const interview = await readFile(new URL("../dist/client/articles-media/ird-fails-to-communicate-student-loan-interest-rate-changes-to-kiwis-living-abroad/index.html", import.meta.url), "utf8");
  assert.match(interview, /Te Waha Nui examines changes to overseas student-loan interest rates/);
});

test("production discovery files and legacy redirects are emitted", async () => {
  const robots = await readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  const booking = await readFile(new URL("../dist/client/book-a-consultation/index.html", import.meta.url), "utf8");
  const studentLoans = await readFile(new URL("../dist/client/student-loan-negotiations/index.html", import.meta.url), "utf8");
  const taxDebt = await readFile(new URL("../dist/client/ird-disputes-tax-penalties-negotiation/index.html", import.meta.url), "utf8");
  const legacyArticle = await readFile(new URL("../dist/client/2026/07/28/overseas-student-loan-default-deal/index.html", import.meta.url), "utf8");
  assert.match(robots, /Allow: \//);
  assert.match(robots, /https:\/\/davetaxnz\.nz\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/davetaxnz\.nz\/articles-media\//);
  assert.match(booking, /https:\/\/davetaxnz\.nz\/#contact/);
  assert.match(studentLoans, /https:\/\/davetaxnz\.nz\/#student-loans/);
  assert.match(taxDebt, /https:\/\/davetaxnz\.nz\/#tax-debt/);
  assert.match(legacyArticle, /\/articles-media\/overseas-student-loan-default-deal\//);
});
