#!/usr/bin/env node
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { articles } from "../src/articles.js";

const root = path.resolve(import.meta.dirname, "..");
const clientDir = path.join(root, "dist", "client");
const ssrDir = path.join(root, "dist", "ssr");

await build({
  configFile: path.join(root, "vite.config.mjs"),
  build: { ssr: path.join(root, "src", "App.jsx"), outDir: ssrDir, emptyOutDir: true },
});

const bundle = path.join(ssrDir, "App.js");
const { App } = await import(`${pathToFileURL(bundle).href}?v=${Date.now()}`);
const template = readFileSync(path.join(clientDir, "index.html"), "utf8");
const siteOrigin = "https://davetaxnz.nz";

const pages = [
  { path: "", title: "Student Loan Lawyer NZ | IRD Negotiator | Dave Ananth", description: "Dave Ananth advises on overseas New Zealand student-loan matters and IRD tax-debt negotiations for individuals and businesses." },
  { path: "articles-media", title: "Articles & Media Archive | Dave Ananth", description: "Search Dave Ananth’s articles, interviews and media coverage by subject and publication type." },
  { path: "testimonials", title: "Client Testimonials | Dave Ananth", description: "Source-approved client experiences concerning Dave Ananth’s student-loan work." },
  { path: "student-loan-negotiations", title: "Student Loan Negotiations & IRD Help | Dave Ananth", description: "Practical information for overseas New Zealand student-loan borrowers considering engagement, repayment, remission and return-to-New-Zealand risks." },
  { path: "ird-disputes-tax-penalties-negotiation", title: "Tax Debt, IRD Disputes & Negotiations | Dave Ananth", description: "Practical information about selected Inland Revenue tax-debt, negotiation and enforcement matters for individuals and businesses." },
  { path: "terms", title: "Terms of Use | DaveTaxNZ", description: "Terms governing use of the DaveTaxNZ professional information, publication and media platform." },
  { path: "privacy", title: "Privacy Statement | DaveTaxNZ", description: "How DaveTaxNZ handles information provided through this website and its contact channels." },
  { path: "legal-disclaimer", title: "Legal & Engagement Disclaimer | DaveTaxNZ", description: "Important information about general website content, contact, confidentiality and formal legal engagement." },
];

for (const article of articles) pages.push({ path: `articles-media/${article.slug}`, title: `${article.title} | Dave Ananth`, description: article.summary });

function pageHtml(page) {
  const pathname = `/${page.path}${page.path ? "/" : ""}`;
  const url = `${siteOrigin}${pathname}`;
  const matchingArticle = articles.find((article) => page.path === `articles-media/${article.slug}`);
  const schema = matchingArticle ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: matchingArticle.title, datePublished: matchingArticle.isoDate, author: matchingArticle.type === "Articles by Dave" ? { "@type": "Person", name: "Dave Ananth" } : { "@type": "Organization", name: matchingArticle.publication }, publisher: { "@type": "Organization", name: matchingArticle.publication }, mainEntityOfPage: url },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` }, { "@type": "ListItem", position: 2, name: "Articles & Media", item: `${siteOrigin}/articles-media/` }, { "@type": "ListItem", position: 3, name: matchingArticle.title, item: url }] },
    ],
  } : {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "DaveTaxNZ", url: `${siteOrigin}/` },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` }, ...(page.path ? [{ "@type": "ListItem", position: 2, name: page.title.split(" | ")[0], item: url }] : [])] },
    ],
  };
  const content = renderToStaticMarkup(React.createElement(App, { initialPath: pathname }));
  let html = template
    .replaceAll("__PAGE_TITLE__", page.title)
    .replaceAll("__PAGE_DESCRIPTION__", page.description)
    .replaceAll("__PAGE_URL__", url)
    .replaceAll("__PAGE_SCHEMA__", JSON.stringify(schema).replaceAll("<", "\\u003c"))
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);

  if (matchingArticle) {
    html = html
      .replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />');
    if (matchingArticle.image) {
      const imageUrl = new URL(matchingArticle.image, siteOrigin).href;
      html = html
        .replace('https://davetaxnz.nz/og.png', imageUrl)
        .replace('Dave Ananth — Student Loan Lawyer NZ and IRD Negotiator', matchingArticle.imageAlt ?? matchingArticle.title)
        .replace('<meta property="og:image:width" content="1200" />', `<meta property="og:image:width" content="${matchingArticle.imageWidth ?? 1200}" />`)
        .replace('<meta property="og:image:height" content="630" />', `<meta property="og:image:height" content="${matchingArticle.imageHeight ?? 630}" />`)
        .replace('https://davetaxnz.nz/og.png', imageUrl);
    } else {
      html = html
        .replace(/^\s*<meta property="og:image"[^\n]*\n/gm, "")
        .replace(/^\s*<meta property="og:image:(?:width|height|alt)"[^\n]*\n/gm, "")
        .replace(/^\s*<meta name="twitter:image"[^\n]*\n/gm, "");
    }
  }

  return html;
}

for (const page of pages) {
  const destination = page.path ? path.join(clientDir, page.path, "index.html") : path.join(clientDir, "index.html");
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, pageHtml(page));
}

const redirects = [
  ["book-a-consultation", "/#contact"],
  ...articles.flatMap((article) => {
    const legacyUrls = [...new Set([
      ...(article.publication === "DaveTaxNZ" ? [article.url] : []),
      ...(article.legacyUrl ? [article.legacyUrl] : []),
      ...(article.legacyAliases ?? []),
    ])];
    return legacyUrls.map((legacyUrl) => [new URL(legacyUrl).pathname.replace(/^\//, "").replace(/\/$/, ""), `/articles-media/${article.slug}/`]);
  }),
];

function redirectHtml(target) {
  const absoluteTarget = new URL(target, siteOrigin).href;
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${absoluteTarget}"><meta http-equiv="refresh" content="0;url=${absoluteTarget}"><title>Page moved | DaveTaxNZ</title><script>location.replace(${JSON.stringify(absoluteTarget)});</script></head><body><p>This page has moved to <a href="${absoluteTarget}">${absoluteTarget}</a>.</p></body></html>`;
}

for (const [legacyPath, target] of redirects) {
  const destination = path.join(clientDir, legacyPath, "index.html");
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, redirectHtml(target));
}

const notFound = { path: "missing", title: "Page not found | DaveTaxNZ", description: "The requested DaveTaxNZ page could not be found." };
writeFileSync(path.join(clientDir, "404.html"), pageHtml(notFound));
writeFileSync(path.join(clientDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${siteOrigin}/${page.path ? `${page.path}/` : ""}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(path.join(clientDir, "sitemap.xml"), sitemap);
rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${pages.length} substantive HTML routes, ${redirects.length} legacy redirects, sitemap.xml and 404.html`);
