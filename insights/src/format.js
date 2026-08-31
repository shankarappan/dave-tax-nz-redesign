export const number = (value) =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 0 }).format(
        value,
      );
export const percent = (value) =>
  value === null || value === undefined ? "—" : `${(value * 100).toFixed(1)}%`;
export function date(value) {
  return value
    ? new Date(`${value}T12:00:00Z`).toLocaleDateString("en-NZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";
}
export const period = (value) =>
  value
    ? `${date(value.start)} – ${date(value.end)}`
    : "Waiting for completed-day data";
export function csvText(columns, rows) {
  const cell = (value) => {
    const text = String(value ?? "");
    return `"${(/^[\s]*[=+\-@\t\r]/.test(text) ? "'" : "") + text.replaceAll('"', '""')}"`;
  };
  return (
    "\uFEFF" +
    [
      columns.map((c) => cell(c.label)).join(","),
      ...rows.map((row) =>
        columns.map((c) => cell(c.raw ? c.raw(row) : row[c.key])).join(","),
      ),
    ].join("\r\n")
  );
}
export function safeSitePath(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const u = new URL(value, "https://davetaxnz.nz");
    return ["davetaxnz.nz", "www.davetaxnz.nz"].includes(u.hostname) &&
      ["http:", "https:"].includes(u.protocol)
      ? u.pathname
      : null;
  } catch {
    return null;
  }
}
export function articleRows(catalog, searchPages, gaPages) {
  const normalize = (path) => path?.replace(/\/$/, "") || "/";
  const search = new Map();
  for (const row of searchPages || []) {
    const path = safeSitePath(row.keys?.[0]);
    if (!path) continue;
    const key = normalize(path);
    const existing = search.get(key) || { clicks: 0, impressions: 0 };
    search.set(key, {
      clicks: existing.clicks + row.clicks,
      impressions: existing.impressions + row.impressions,
    });
  }
  const ga = new Map();
  for (const row of gaPages || []) {
    const key = normalize(row.label);
    ga.set(key, {
      screenPageViews:
        (ga.get(key)?.screenPageViews || 0) + row.screenPageViews,
    });
  }
  return catalog.map((article) => ({
    ...article,
    clicks: search.get(normalize(article.path))?.clicks ?? null,
    impressions: search.get(normalize(article.path))?.impressions ?? null,
    views: ga.get(normalize(article.path))?.screenPageViews ?? null,
  }));
}
