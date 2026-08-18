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
const stagingOrigin = "https://dave-ananth-tax-barrister.shankarappan.chatgpt.site";

const pages = [
  { path: "", title: "Student Loan Lawyer NZ | IRD Negotiator | Dave Ananth", description: "Overseas with New Zealand student-loan debt? Dave Ananth advises on IRD negotiations, penalties, repayment proposals and enforcement risks." },
  { path: "articles-media", title: "Articles & Media Archive | Dave Ananth", description: "Search Dave Ananth’s articles, interviews and media coverage by subject and publication type." },
  { path: "testimonials", title: "Client Testimonials | Dave Ananth", description: "Source-approved client experiences concerning Dave Ananth’s student-loan work." },
  { path: "terms", title: "Terms of Use | DaveTaxNZ", description: "Terms governing use of the DaveTaxNZ professional information, publication and media platform." },
  { path: "privacy", title: "Privacy Statement | DaveTaxNZ", description: "Staging privacy statement for the DaveTaxNZ website, prepared for New Zealand client review." },
  { path: "legal-disclaimer", title: "Legal & Engagement Disclaimer | DaveTaxNZ", description: "Important information about general website content, contact, confidentiality and formal legal engagement." },
];

for (const article of articles) pages.push({ path: `articles-media/${article.slug}`, title: `${article.title} | Dave Ananth`, description: article.summary });

function pageHtml(page) {
  const pathname = `/${page.path}${page.path ? "/" : ""}`;
  const url = `${stagingOrigin}${pathname}`;
  const matchingArticle = articles.find((article) => page.path === `articles-media/${article.slug}`);
  const schema = matchingArticle ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: matchingArticle.title, datePublished: matchingArticle.isoDate, author: matchingArticle.type === "Articles by Dave" ? { "@type": "Person", name: "Dave Ananth" } : { "@type": "Organization", name: matchingArticle.publication }, publisher: { "@type": "Organization", name: matchingArticle.publication }, mainEntityOfPage: url },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${stagingOrigin}/` }, { "@type": "ListItem", position: 2, name: "Articles & Media", item: `${stagingOrigin}/articles-media/` }, { "@type": "ListItem", position: 3, name: matchingArticle.title, item: url }] },
    ],
  } : {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "DaveTaxNZ", url: `${stagingOrigin}/` },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${stagingOrigin}/` }, ...(page.path ? [{ "@type": "ListItem", position: 2, name: page.title.split(" | ")[0], item: url }] : [])] },
    ],
  };
  const content = renderToStaticMarkup(React.createElement(App, { initialPath: pathname }));
  return template
    .replaceAll("__PAGE_TITLE__", page.title)
    .replaceAll("__PAGE_DESCRIPTION__", page.description)
    .replaceAll("__PAGE_URL__", url)
    .replaceAll("__PAGE_SCHEMA__", JSON.stringify(schema).replaceAll("<", "\\u003c"))
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

for (const page of pages) {
  const destination = page.path ? path.join(clientDir, page.path, "index.html") : path.join(clientDir, "index.html");
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, pageHtml(page));
}

const notFound = { path: "missing", title: "Page not found | DaveTaxNZ", description: "The requested DaveTaxNZ page could not be found." };
writeFileSync(path.join(clientDir, "404.html"), pageHtml(notFound));
writeFileSync(path.join(clientDir, "robots.txt"), "User-agent: *\nDisallow: /\n");
rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${pages.length} substantive HTML routes plus 404.html`);
