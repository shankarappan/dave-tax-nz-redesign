#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { decode } from "entities";
import sanitizeHtml from "sanitize-html";

const root = path.resolve(import.meta.dirname, "..");
const backupDir = path.join(root, "content-backups", "wordpress-20260820");
const posts = JSON.parse(readFileSync(path.join(backupDir, "posts.json"), "utf8"));
const media = JSON.parse(readFileSync(path.join(backupDir, "featured-media.json"), "utf8"));
const oldOrigin = "https://davetaxnz.nz";

const classifications = {
  "malaysia-needs-gst-again": { subject: "Tax Policy", publication: "Free Malaysia Today", relationship: "Opinion article by Dave Ananth; republished on DaveTaxNZ", sourceUrl: "https://www.freemalaysiatoday.com/category/opinion/2026/08/17/malaysia-needs-gst-again", summary: "Dave argues that Malaysia needs a broad-based consumption tax, alongside protections for lower-income households, prompt business refunds and transparent public accounting." },
  "nz-crypto-tax-disposals": { subject: "Crypto Tax", relationship: "Written by Dave Ananth; republished from Interest.co.nz", sourceUrl: "https://www.interest.co.nz/personal-finance/139687/dave-ananth-points-out-crypto-disposals-trigger-income-tax-any-profits-each", suppressFeaturedImage: true },
  "overseas-student-loan-default-deal": { subject: "Student Loans", relationship: "Republished with commentary and analysis by Dave Ananth", sourceUrl: "https://www.stuff.co.nz/nz-news/361012265/doctors-180000-student-loan-standoff-ends-deal", suppressFeaturedImage: true },
  "ird-statutory-demand-critical-10-day-guide": { subject: "IRD Tax Debt", suppressFeaturedImage: true },
  "nz-student-loan-border-arrest": { subject: "Student Loans", internalSlug: "student-loan-border-arrest", relationship: "Republished with commentary and analysis by Dave Ananth", sourceUrl: "https://www.stuff.co.nz/nz-news/360997679/doctor-built-life-overseas-now-hes-been-arrested-airport-over-180000-student-loan-debt", suppressFeaturedImage: true },
  "gst-as-working-capital-critical-ird-fix": { subject: "IRD Tax Debt", relationship: "Written by Dave Ananth; republished from Interest.co.nz", sourceUrl: "https://www.interest.co.nz/business/139325/gst-becoming-working-capital-why-earlier-intervention-could-save-viable-businesses", legacyAliases: ["https://davetaxnz.nz/2026/07/11/https-davetaxnz-nz-articles-advice-gst-as-working-capital/"], suppressFeaturedImage: true },
  "ird-tax-debt-rehabilitation": { subject: "IRD Tax Debt", sourceUrl: "https://www.rnz.co.nz/national/programmes/ninetonoon/audio/2019041554/inland-revenue-crackdown-on-tax-debt-continues" },
  "i-live-in-australia-and-my-nz-student-loan-has-doubled-what-can-i-do": { subject: "Student Loans" },
  "can-ird-arrest-me-at-the-border-over-my-student-loan": { subject: "Student Loans" },
  "ird-fails-to-communicate-student-loan-interest-rate-changes-to-kiwis-living-abroad": { subject: "Student Loans", type: "Media Interviews", publication: "Te Waha Nui", relationship: "Interview with Dave Ananth", sourceUrl: "https://tewahanui.nz/politics/ird-fails-to-communicate-student-loan-interest-rate-changes-to-kiwis-living-abroad", detailDescription: "Te Waha Nui examines changes to overseas student-loan interest rates and how those changes were communicated to borrowers living abroad. Dave Ananth comments on repayment settings, enforcement and the effect on New Zealanders overseas." },
  "dave-ananth-wants-to-see-a-different-approach-to-collecting-tax-arrears-from-businesses": { subject: "IRD Tax Debt" },
  "davetaxnz-student-loan-repayment-challenges": { subject: "Student Loans", relationship: "Written by Dave Ananth; republished from Interest.co.nz", sourceUrl: "https://www.interest.co.nz/personal-finance/137543/dave-ananth-says-student-loan-repayment-obligations-are-often-much-tougher" },
  "tax-debt-enforcement-timing": { subject: "IRD Tax Debt", relationship: "Written by Dave Ananth; republished from Interest.co.nz", sourceUrl: "https://www.interest.co.nz/personal-finance/137242/dave-ananth-reports-ird-systems-prioritise-tax-debt-enforcement-even", suppressFeaturedImage: true },
  "student-loan-interest-dave-ananth-analysis": { subject: "Student Loans", relationship: "Written by Dave Ananth; republished from Interest.co.nz", sourceUrl: "https://www.interest.co.nz/personal-finance/136799/dave-ananth-makes-case-some-basic-reasonable-flexibility-way-interest" },
  "ird-crackdown-overseas-student-loan-debt-davetaxnz": { subject: "Student Loans", type: "Media Interviews", publication: "RNZ", relationship: "Interview with Dave Ananth", sourceUrl: "https://www.rnz.co.nz/national/programmes/ninetonoon/audio/2019003626/ird-cracks-down-on-overseas-student-debt", legacyAliases: ["https://davetaxnz.nz/2026/01/13/dave-ananth-on-rnz-nine-to-noon-ird-cracks-down-on-overseas-student-loan-debt/"] },
  "dave-ananth-student-loan-enforcement-newstalk": { subject: "Student Loans", type: "Media Coverage", publication: "Newstalk ZB", relationship: "Coverage featuring commentary from Dave Ananth", sourceUrl: "https://www.newstalkzb.co.nz/on-air/christchurch/canterbury-mornings-with-john-macdonald/opinion/john-macdonald-the-hardline-stance-on-student-loans-is-backfiring/", legacyAliases: ["https://davetaxnz.nz/2026/01/13/dave-ananth-commentary-on-student-loan-enforcement/"] },
  "ird-tax-debt-commercial-judgment": { subject: "IRD Tax Debt", suppressFeaturedImage: true },
  "ird-tax-debt-negotiation-beats-liquidation": { subject: "IRD Tax Debt", suppressFeaturedImage: true },
  "ird-compliance-return-kpi-impact-on-nz-taxpayers": { subject: "IRD Tax Debt", legacyAliases: ["https://davetaxnz.nz/2025/12/04/when-tax-becomes-a-kpi-irds-11-81-return-on-compliance-and-what-it-means-for-ordinary-new-zealanders/"] },
};

const mediaById = new Map(media.map((item) => [item.id, item]));
const postByLegacyPath = new Map(posts.map((post) => [new URL(post.link).pathname.replace(/\/$/, ""), post]));
for (const post of posts) {
  for (const alias of classifications[post.slug]?.legacyAliases ?? []) {
    postByLegacyPath.set(new URL(alias).pathname.replace(/\/$/, ""), post);
  }
}

function localAssetUrl(sourceUrl) {
  const url = new URL(sourceUrl);
  if (url.hostname !== "davetaxnz.nz" || !url.pathname.startsWith("/wp-content/uploads/")) return sourceUrl;
  return `/assets/wordpress${url.pathname.slice("/wp-content/uploads".length)}`;
}

function cleanText(html) {
  return decode(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSummary(text, max = 210) {
  if (text.length <= max) return text;
  const shortened = text.slice(0, max + 1);
  const sentence = shortened.match(/^(.{80,}?[.!?])(?:\s|$)/);
  if (sentence) return sentence[1];
  return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`;
}

function rewriteLink(href) {
  try {
    const url = new URL(href, oldOrigin);
    if (url.hostname === "davetaxnz.nz") {
      if (url.pathname === "/book-a-consultation/" || url.pathname === "/book-a-consultation") return "/#contact";
      const post = postByLegacyPath.get(url.pathname.replace(/\/$/, ""));
      if (post) return `/articles-media/${classifications[post.slug]?.internalSlug ?? post.slug}/`;
    }
    return url.href;
  } catch {
    return href;
  }
}

function cleanContent(html) {
  let cleaned = sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "strong", "b", "em", "i", "a", "img", "br", "sup"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
      ol: ["start"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (_tagName, attributes) => {
        const href = rewriteLink(attributes.href ?? "");
        const external = /^https?:\/\//.test(href);
        return { tagName: "a", attribs: { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } };
      },
      img: (_tagName, attributes) => ({
        tagName: "img",
        attribs: {
          src: localAssetUrl(attributes.src ?? ""),
          alt: attributes.alt ?? "",
          ...(attributes.width ? { width: attributes.width } : {}),
          ...(attributes.height ? { height: attributes.height } : {}),
          loading: "lazy",
          decoding: "async",
        },
      }),
    },
  });
  cleaned = cleaned
    // The former Stace Hammond publication URLs are retired. Keep the migrated
    // DaveTaxNZ article, but do not regenerate a dead trailing source link.
    .replace(/(?:<br\s*\/?\s*>\s*){2}Read the full article here:\s*[“"]?<a href="https:\/\/(?:www\.)?stacehammond\.co\.nz\/[^"<]*"[^>]*>.*?<\/a>[”"“]?/gi, "")
    .replace(/<p>(?:\s|&nbsp;|\u00a0|<br\s*\/?\s*>)*<\/p>/gi, "")
    .replace(/(?:<br\s*\/?\s*>\s*){3,}/gi, "<br><br>")
    .trim();
  return cleaned;
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${isoDate}T00:00:00Z`));
}

const imageUrls = new Set();
for (const post of posts) {
  for (const match of post.content.rendered.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    if (match[1].startsWith(`${oldOrigin}/wp-content/uploads/`)) imageUrls.add(match[1]);
  }
  const featured = mediaById.get(post.featured_media)?.source_url;
  if (featured?.startsWith(`${oldOrigin}/wp-content/uploads/`)) imageUrls.add(featured);
}

writeFileSync(path.join(backupDir, "image-urls.txt"), `${[...imageUrls].sort().join("\n")}\n`);

const wordpressArticles = posts.map((post) => {
  const classification = classifications[post.slug];
  if (!classification) throw new Error(`Missing classification for ${post.slug}`);
  const isoDate = post.date.slice(0, 10);
  const title = cleanText(post.title.rendered);
  const excerpt = cleanText(post.excerpt.rendered);
  const featured = mediaById.get(post.featured_media);
  return {
    slug: classification.internalSlug ?? post.slug,
    wordpressSlug: post.slug,
    subject: classification.subject,
    type: classification.type ?? "Articles by Dave",
    publication: classification.publication ?? "DaveTaxNZ",
    relationship: classification.relationship ?? "Written by Dave Ananth",
    date: formatDate(isoDate),
    isoDate,
    title,
    summary: classification.summary ?? truncateSummary(excerpt || cleanText(post.content.rendered)),
    ...(classification.detailDescription ? { detailDescription: classification.detailDescription } : {}),
    url: post.link,
    legacyUrl: post.link,
    ...(classification.legacyAliases ? { legacyAliases: classification.legacyAliases } : {}),
    ...(classification.sourceUrl ? { sourceUrl: classification.sourceUrl } : {}),
    ...(classification.suppressFeaturedImage ? { suppressFeaturedImage: true } : {}),
    ...(featured ? {
      image: localAssetUrl(featured.source_url),
      imageAlt: featured.alt_text || title,
      imageWidth: featured.media_details?.width,
      imageHeight: featured.media_details?.height,
    } : {}),
    contentHtml: cleanContent(post.content.rendered),
  };
}).sort((a, b) => b.isoDate.localeCompare(a.isoDate));

const output = `// Generated from the preserved WordPress export by scripts/import-wordpress.mjs.\n// Do not edit this file by hand; update the import source and rerun the importer.\nexport const wordpressArticles = ${JSON.stringify(wordpressArticles, null, 2)};\n`;
writeFileSync(path.join(root, "src", "wordpressArticles.js"), output);

console.log(`Imported ${wordpressArticles.length} WordPress posts and prepared a ${imageUrls.size}-image download manifest`);
