import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { articles } from "../../src/articles.js";
await mkdir(new URL("../public/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../../public/assets/dave-ananth-logo.webp", import.meta.url),
  new URL("../public/brand.webp", import.meta.url),
);
const catalog = articles.map(({ slug, title, type, date }) => ({
  slug,
  title,
  type,
  date,
  path: `/articles-media/${slug}/`,
}));
await writeFile(
  new URL("../public/catalog.json", import.meta.url),
  JSON.stringify(catalog),
);
console.log(
  `Prepared ${catalog.length} public article titles. No reporting credentials included.`,
);
