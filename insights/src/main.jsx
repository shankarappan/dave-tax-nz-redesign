import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ChartLineUp,
  MagnifyingGlass,
  Newspaper,
  UsersThree,
  Phone,
  ShieldCheck,
  SignOut,
  DownloadSimple,
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  Info,
  CheckCircle,
  WarningCircle,
  LockKey,
  Globe,
  TrendUp,
  CalendarBlank,
} from "@phosphor-icons/react";
import {
  number,
  percent,
  date,
  period,
  csvText,
  articleRows,
  safeSitePath,
} from "./format.js";
import "./styles.css";

const sections = [
  ["Overview", ChartLineUp],
  ["Google search", MagnifyingGlass],
  ["Articles", Newspaper],
  ["Audience", UsersThree],
  ["Contact activity", Phone],
  ["Site health", ShieldCheck],
];
function Source({ children, ready = true }) {
  return (
    <span className={`source ${ready ? "" : "pending"}`}>
      <span />
      {children}
    </span>
  );
}
function Note({ children }) {
  return (
    <div className="note">
      <Info size={19} />
      <div>{children}</div>
    </div>
  );
}
function Empty({ title = "A clear view starts with reliable data", children }) {
  return (
    <div className="empty">
      <ChartLineUp size={30} />
      <h3>{title}</h3>
      <p>
        {children ||
          "No rows were returned for this period. This is not the same as a confirmed zero."}
      </p>
    </div>
  );
}
function Metric({ label, value, description, change }) {
  return (
    <article className="metric">
      <p>{label}</p>
      <strong>{value}</strong>
      <div>
        {Number.isFinite(change) ? (
          <span className={change >= 0 ? "delta" : "delta down"}>
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}% vs previous period
          </span>
        ) : (
          <span className="metric-note">{description}</span>
        )}
      </div>
    </article>
  );
}
function Panel({ eyebrow, title, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function Table({
  title,
  columns,
  rows,
  empty,
  filename = "davetax-report",
  initialSort,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(
    initialSort || { key: columns[0].key, desc: false },
  );
  const filtered = useMemo(
    () =>
      rows
        .filter((row) =>
          columns.some((c) =>
            String(row[c.key] ?? "")
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
        )
        .sort((a, b) => {
          const av = a[sort.key],
            bv = b[sort.key];
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          return (
            (typeof av === "number"
              ? av - bv
              : String(av).localeCompare(String(bv))) * (sort.desc ? -1 : 1)
          );
        }),
    [rows, query, sort, columns],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const current = Math.min(page, pages - 1);
  function download() {
    const blob = new Blob([csvText(columns, filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="table-block">
      <div className="table-tools">
        <label className="search">
          <MagnifyingGlass size={18} />
          <span className="sr-only">Search {title}</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={`Find ${title.toLowerCase()}…`}
          />
        </label>
        <button
          className="text-button"
          onClick={download}
          disabled={!filtered.length}
        >
          <DownloadSimple size={18} /> Export CSV
        </button>
      </div>
      {filtered.length ? (
        <>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label={`${title} data`}
          >
            <table>
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={
                        sort.key === c.key
                          ? sort.desc
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                    >
                      <button
                        onClick={() =>
                          setSort({
                            key: c.key,
                            desc: sort.key === c.key ? !sort.desc : true,
                          })
                        }
                      >
                        {c.label}
                        {sort.key === c.key && (
                          <span aria-hidden="true">
                            {" "}
                            {sort.desc ? "↓" : "↑"}
                          </span>
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(current * 8, current * 8 + 8).map((row, i) => (
                  <tr key={row.path || row.label || i}>
                    {columns.map((c) => (
                      <td key={c.key}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span>
              {current * 8 + 1}–{Math.min((current + 1) * 8, filtered.length)}{" "}
              of {number(filtered.length)}
            </span>
            <div>
              <button
                aria-label="Previous page"
                disabled={!current}
                onClick={() => setPage(current - 1)}
              >
                <CaretLeft />
              </button>
              <span>
                Page {current + 1} of {pages}
              </span>
              <button
                aria-label="Next page"
                disabled={current + 1 >= pages}
                onClick={() => setPage(current + 1)}
              >
                <CaretRight />
              </button>
            </div>
          </div>
        </>
      ) : (
        <Empty title={query ? "No matching results" : undefined}>
          {query ? "Try another search or clear the search field." : empty}
        </Empty>
      )}
    </div>
  );
}
function Bars({ rows, metric, label = "label", suffix = "" }) {
  const max = Math.max(1, ...rows.map((row) => row[metric] || 0));
  return rows.length ? (
    <ol className="bar-list">
      {rows.slice(0, 6).map((row, i) => (
        <li key={i}>
          <div>
            <span>{row[label]}</span>
            <strong>
              {number(row[metric])}
              {suffix}
            </strong>
          </div>
          <div className="bar-track" aria-hidden="true">
            <span
              style={{
                width: `${Math.max(1, ((row[metric] || 0) / max) * 100)}%`,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  ) : (
    <Empty />
  );
}
function Daily({ rows }) {
  const sorted = [...rows].sort((a, b) => a.keys[0].localeCompare(b.keys[0]));
  const max = Math.max(1, ...sorted.map((r) => r.clicks));
  return sorted.length ? (
    <>
      <div
        className="daily-chart"
        role="img"
        aria-label={`Daily Google search clicks from ${date(sorted[0].keys[0])} to ${date(sorted.at(-1).keys[0])}. Exact values in the table below.`}
      >
        {sorted.map((row) => (
          <div
            key={row.keys[0]}
            title={`${date(row.keys[0])}: ${number(row.clicks)} clicks`}
          >
            <span
              style={{ height: `${Math.max(1, (row.clicks / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="chart-axis">
        <span>{date(sorted[0].keys[0])}</span>
        <span>Google search clicks / day</span>
        <span>{date(sorted.at(-1).keys[0])}</span>
      </div>
      <details>
        <summary>View daily values</summary>
        <div className="daily-values">
          {sorted.map((row) => (
            <p key={row.keys[0]}>
              <span>{date(row.keys[0])}</span>
              <strong>{number(row.clicks)} clicks</strong>
            </p>
          ))}
        </div>
      </details>
    </>
  ) : (
    <Empty />
  );
}
const change = (now, before) =>
  typeof now === "number" && typeof before === "number" && before > 0
    ? ((now - before) / before) * 100
    : undefined;
const numeric = (key, label) => ({
  key,
  label,
  render: (row) => number(row[key]),
});
const searchRows = (rows) =>
  (rows || []).map((row) => ({ label: row.keys?.[0] || "", ...row }));
const searchColumns = [
  { key: "label", label: "Search term" },
  numeric("clicks", "Clicks"),
  numeric("impressions", "Impressions"),
  { key: "ctr", label: "Click rate", render: (r) => percent(r.ctr) },
  {
    key: "position",
    label: "Avg. position",
    render: (r) => r.position.toFixed(1),
  },
];
function App() {
  const [section, setSection] = useState("Overview");
  const [days, setDays] = useState(28);
  const [report, setReport] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError("");
    setReport(null);
    Promise.all([
      fetch(`/api/report?days=${days}`, {
        signal: abort.signal,
        cache: "no-store",
      }).then(async (r) => {
        if (!r.ok)
          throw new Error(
            r.status === 401 || r.status === 403
              ? "Your sign-in has expired or this account does not have access. Please sign in again."
              : "Reporting is unavailable at the moment. No website data has been changed.",
          );
        const content = r.headers.get("content-type") || "";
        if (!content.includes("application/json"))
          throw new Error("Please sign in again to view the private report.");
        return r.json();
      }),
      fetch("/catalog.json", { signal: abort.signal }).then((r) => {
        if (!r.ok) throw new Error("The article catalogue is unavailable.");
        return r.json();
      }),
    ])
      .then(([data, items]) => {
        setReport(data);
        setCatalog(items);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [days, refresh]);
  const sc = report?.search || {};
  const ga = report?.analytics || {};
  const gaRows = ga.reports || {};
  const total = gaRows.summary?.[0];
  const oldTotal = gaRows.previousSummary?.[0];
  const articles = useMemo(
    () => articleRows(catalog, sc.pages, gaRows.pages),
    [catalog, sc.pages, gaRows.pages],
  );
  const ranked = articles
    .filter((a) => a.clicks !== null)
    .sort((a, b) => b.clicks - a.clicks);
  const descriptions = {
    Overview: "Your website, in perspective.",
    "Google search": "Understand how people discover Dave.",
    Articles: "See which stories bring people to the website.",
    Audience: "Understand your audience, without identifying individuals.",
    "Contact activity": "From interest to the next conversation.",
    "Site health": "A practical check of the public website.",
  };
  const articleColumns = [
    {
      key: "title",
      label: "Article",
      render: (r) => (
        <a
          className="article-link"
          href={`https://davetaxnz.nz${r.path}`}
          target="_blank"
          rel="noreferrer"
        >
          {r.title}
          <ArrowUpRight size={15} />
          <small>
            {r.type} · {r.date}
          </small>
        </a>
      ),
    },
    numeric("clicks", "Search clicks"),
    numeric("impressions", "Impressions"),
    numeric("views", "Page views"),
  ];
  return (
    <div className="app">
      <a href="#main" className="skip">
        Skip to report
      </a>
      <aside className="sidebar">
        <a
          className="brand"
          href="https://davetaxnz.nz"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/brand.webp" alt="Dave Ananth" width="148" height="113" />
        </a>
        <div className="workspace-label">
          OWNER WORKSPACE<span>Website insights</span>
        </div>
        <nav aria-label="Report sections">
          {sections.map(([label, Icon]) => (
            <button
              key={label}
              aria-current={section === label ? "page" : undefined}
              onClick={() => setSection(label)}
            >
              <Icon size={21} />
              <span>{label}</span>
              {section === label && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="private-label">
            <LockKey size={18} />
            <div>
              Private & read-only
              <small>Your content stays in your control.</small>
            </div>
          </div>
          <a href="https://davetaxnz.nz" target="_blank" rel="noreferrer">
            Visit public website <ArrowUpRight />
          </a>
          <a href="/cdn-cgi/access/logout">
            Sign out <SignOut />
          </a>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="breadcrumb">
            DaveTaxNZ <span>/</span> <strong>{section}</strong>
          </span>
          <div className="topbar-actions">
            <span className="owner-badge">
              <LockKey size={14} /> Owner access
            </span>
            <a
              href="/cdn-cgi/access/logout"
              aria-label="Sign out of owner reporting"
            >
              <SignOut size={18} />
            </a>
          </div>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <p className="eyebrow">THE BIG PICTURE, MADE CLEAR</p>
              <h1>{section === "Overview" ? "Website overview" : section}</h1>
              <p className="lede">{descriptions[section]}</p>
            </div>
            <div className="date-controls">
              <label>
                <CalendarBlank size={18} />
                <span className="sr-only">Reporting period</span>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={28}>Last 28 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </label>
              <button
                className="refresh"
                onClick={() => setRefresh((x) => x + 1)}
                disabled={loading}
                aria-label="Reload report"
              >
                <ArrowClockwise size={19} className={loading ? "spin" : ""} />
              </button>
            </div>
          </div>
          {report?.preview && (
            <Note>
              Local owner preview using live Google reports. Cloudflare sign-in
              must be enabled before this dashboard can be published.
            </Note>
          )}
          {loading ? (
            <div className="loading" role="status">
              <span className="loading-line" />
              <p>Bringing your reporting together…</p>
              <small>
                Reading Google Search Console and Analytics securely.
              </small>
            </div>
          ) : error ? (
            <div className="error" role="alert">
              <WarningCircle size={30} />
              <h2>We couldn’t load this report</h2>
              <p>{error}</p>
              <button
                className="primary"
                onClick={() => setRefresh((x) => x + 1)}
              >
                Try again <ArrowClockwise />
              </button>
            </div>
          ) : (
            <>
              <div className="source-strip">
                <Source ready={sc.status === "ready"}>
                  Search Console ·{" "}
                  {sc.status === "ready" ? "Connected" : "Needs attention"}
                </Source>
                <Source ready={ga.status === "ready"}>
                  Analytics ·{" "}
                  {ga.status === "ready"
                    ? "Connected"
                    : ga.status === "error"
                      ? "Needs attention"
                      : "Awaiting data"}
                </Source>
                <span className="updated">
                  Retrieved{" "}
                  {new Date(report.generatedAt).toLocaleString("en-NZ", {
                    timeZone: "Pacific/Auckland",
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  NZ time
                </span>
              </div>
              {sc.status === "error" && <Note>{sc.message}</Note>}
              {ga.status === "error" && <Note>{ga.message}</Note>}
              {section === "Overview" && (
                <>
                  <div className="metrics">
                    <Metric
                      label="Google search clicks"
                      value={number(sc.summary?.clicks)}
                      description="Clicks through from Google search"
                      change={change(
                        sc.summary?.clicks,
                        sc.previousSummary?.clicks,
                      )}
                    />
                    <Metric
                      label="Search impressions"
                      value={number(sc.summary?.impressions)}
                      description="Times your pages appeared"
                      change={change(
                        sc.summary?.impressions,
                        sc.previousSummary?.impressions,
                      )}
                    />
                    <Metric
                      label="Website visitors"
                      value={number(total?.activeUsers)}
                      description={
                        ga.status === "ready"
                          ? "Active users · new property"
                          : "New Analytics data pending"
                      }
                      change={change(total?.activeUsers, oldTotal?.activeUsers)}
                    />
                    <Metric
                      label="Page views"
                      value={number(total?.screenPageViews)}
                      description={
                        ga.status === "ready"
                          ? "Views, including repeat visits"
                          : "Will appear as data arrives"
                      }
                      change={change(
                        total?.screenPageViews,
                        oldTotal?.screenPageViews,
                      )}
                    />
                  </div>
                  <p className="period-note">
                    Search: {period(sc.period)} · Analytics: {period(ga.period)}
                    . Each source uses its own reporting calendar.
                  </p>
                  <div className="overview-grid">
                    <Panel
                      eyebrow="SEARCH VISIBILITY"
                      title="How discovery is changing"
                      action={
                        <button
                          className="text-button"
                          onClick={() => setSection("Google search")}
                        >
                          Explore search <ArrowUpRight />
                        </button>
                      }
                    >
                      <Daily rows={sc.daily || []} />
                    </Panel>
                    <Panel
                      className="perspective"
                      eyebrow="YOUR NEXT STEPS"
                      title="A useful starting point"
                    >
                      <span className="perspective-icon">
                        <TrendUp size={30} />
                      </span>
                      <h3>
                        {ranked.length
                          ? "Build on the stories people find."
                          : "Let the evidence guide you."}
                      </h3>
                      <p>
                        {ranked.length
                          ? "Review the articles attracting Google search clicks. Keep useful information current and make the next step easy to find."
                          : "Search history is connected. Website audience and contact-click reports will fill in as the new Analytics property collects data."}
                      </p>
                      <button onClick={() => setSection("Articles")}>
                        Review your articles <ArrowRight size={19} />
                      </button>
                      <div className="editorial-rule" />
                      <small>
                        There is no single “SEO score” that guarantees rankings.
                        This workspace shows measured performance, not promises.
                      </small>
                    </Panel>
                  </div>
                  <div className="two-up">
                    <Panel
                      eyebrow="CONTENT THAT CONNECTS"
                      title="Leading articles in search"
                      action={
                        <button
                          className="text-button"
                          onClick={() => setSection("Articles")}
                        >
                          All articles <ArrowUpRight />
                        </button>
                      }
                    >
                      {ranked.length ? (
                        <ol className="article-ranking">
                          {ranked.slice(0, 4).map((article, i) => (
                            <li key={article.slug}>
                              <span className="rank">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <a
                                href={`https://davetaxnz.nz${article.path}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {article.title}
                                <small>{article.type}</small>
                              </a>
                              <strong>
                                {number(article.clicks)}
                                <small>clicks</small>
                              </strong>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <Empty>
                          No article-detail URLs appeared in the returned search
                          rows. The full catalogue is still available under
                          Articles.
                        </Empty>
                      )}
                    </Panel>
                    <Panel
                      eyebrow="MEASUREMENT NOTES"
                      title="Know what you’re looking at"
                    >
                      <ul className="insight-list">
                        <li>
                          <CheckCircle />
                          <div>
                            <strong>Search history is retained</strong>
                            <p>
                              Search Console follows the domain. Its reporting
                              can span the old and new websites.
                            </p>
                          </div>
                        </li>
                        <li>
                          <ChartLineUp />
                          <div>
                            <strong>A clean new Analytics baseline</strong>
                            <p>
                              {ga.status === "ready"
                                ? `Collection starts ${date(ga.collectionStart)}.`
                                : "The new property is connected; its tag still needs publishing."}{" "}
                              Missing history is shown as unavailable, not zero.
                            </p>
                          </div>
                        </li>
                        <li>
                          <LockKey />
                          <div>
                            <strong>Reporting, not website control</strong>
                            <p>
                              This dashboard cannot edit articles, delete
                              content or change DNS.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </Panel>
                  </div>
                </>
              )}
              {section === "Google search" && (
                <>
                  <div className="section-description">
                    <p>
                      Google Search Console · Web search · {period(sc.period)}
                    </p>
                    <small>
                      Final data only. Search reporting uses Pacific time and is
                      deliberately delayed; it is not a live visitor counter.
                    </small>
                  </div>
                  <div className="metrics">
                    <Metric
                      label="Search clicks"
                      value={number(sc.summary?.clicks)}
                      description="Clicks to your website"
                    />
                    <Metric
                      label="Impressions"
                      value={number(sc.summary?.impressions)}
                      description="Appearances in search results"
                    />
                    <Metric
                      label="Click-through rate"
                      value={percent(sc.summary?.ctr)}
                      description="Clicks divided by impressions"
                    />
                    <Metric
                      label="Average position"
                      value={sc.summary ? sc.summary.position.toFixed(1) : "—"}
                      description="Lower is generally better"
                    />
                  </div>
                  <Panel title="What people search for" eyebrow="DISCOVERY">
                    <Table
                      title="Search terms"
                      columns={searchColumns}
                      rows={searchRows(sc.queries)}
                      initialSort={{ key: "clicks", desc: true }}
                      filename={`search-terms-${sc.period?.start || "pending"}-${sc.period?.end || "pending"}`}
                    />
                  </Panel>
                  <Note>
                    Google withholds some low-volume or anonymised queries.
                    These rows are not a complete search log and may not add up
                    to the headline totals.
                    {sc.limited
                      ? " At least one result table reached its 1,000-row limit."
                      : ""}
                  </Note>
                  <Panel
                    title="Pages appearing in Google"
                    eyebrow="SEARCH LANDING PAGES"
                  >
                    <Table
                      title="Pages"
                      columns={[
                        {
                          key: "label",
                          label: "Page",
                          render: (r) =>
                            safeSitePath(r.label) ? (
                              <a
                                className="page-link"
                                href={`https://davetaxnz.nz${safeSitePath(r.label)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {safeSitePath(r.label)}{" "}
                                <ArrowUpRight size={14} />
                              </a>
                            ) : (
                              r.label
                            ),
                        },
                        ...searchColumns.slice(1),
                      ]}
                      rows={searchRows(sc.pages)}
                      initialSort={{ key: "clicks", desc: true }}
                      filename="search-pages"
                    />
                  </Panel>
                </>
              )}
              {section === "Articles" && (
                <>
                  <div className="section-description">
                    <p>
                      {number(catalog.length)} published articles & media
                      entries
                    </p>
                    <small>
                      Search clicks: {period(sc.period)} · Page views:{" "}
                      {period(ga.period)}
                    </small>
                  </div>
                  <Panel
                    eyebrow="YOUR CONTENT LIBRARY"
                    title="Article performance"
                  >
                    <Table
                      title="Articles"
                      rows={articles}
                      columns={articleColumns}
                      initialSort={{ key: "clicks", desc: true }}
                      filename={`article-performance-${days}-days`}
                    />
                  </Panel>
                  <Note>
                    Metrics cover article-detail pages on DaveTaxNZ, not
                    readership on external publishers’ websites. A dash means no
                    matching row was returned, not a verified zero. Legacy
                    WordPress URLs may appear separately under Google search;
                    they are not automatically combined with the new URLs.
                  </Note>
                </>
              )}
              {section === "Audience" && (
                <>
                  <div className="section-description">
                    <p>Google Analytics · {period(ga.period)}</p>
                    <small>
                      Approximate, aggregate audience information. No individual
                      visitor profiles, ages or gender are collected for this
                      report.
                    </small>
                  </div>
                  {ga.status !== "ready" ? (
                    <Empty title="Your new audience baseline is on its way">
                      {ga.message}
                    </Empty>
                  ) : (
                    <div className="two-up">
                      <Panel eyebrow="GEOGRAPHY" title="Where visitors are">
                        <Bars
                          rows={gaRows.countries || []}
                          metric="activeUsers"
                        />
                        <p className="panel-footnote">
                          Active users · top six countries. Location is inferred
                          and can be inaccurate, including when visitors use a
                          VPN.
                        </p>
                      </Panel>
                      <Panel eyebrow="DEVICES" title="How visitors browse">
                        <Bars
                          rows={gaRows.devices || []}
                          metric="activeUsers"
                        />
                        <p className="panel-footnote">
                          Active users by device category. Users may appear in
                          more than one category.
                        </p>
                      </Panel>
                      <Panel
                        eyebrow="ACQUISITION"
                        title="Where visits come from"
                      >
                        <Bars rows={gaRows.channels || []} metric="sessions" />
                        <p className="panel-footnote">
                          Sessions by channel, not unique people.
                        </p>
                      </Panel>
                    </div>
                  )}
                  <Note>
                    Analytics only measures visits it can observe. Browser
                    blocking and consent choices can reduce measured traffic; it
                    should not be treated as an exact count of every visitor.
                  </Note>
                </>
              )}
              {section === "Contact activity" && (
                <>
                  <div className="section-description">
                    <p>Contact-link events · {period(ga.period)}</p>
                    <small>
                      An indication of intent — not completed enquiries or new
                      clients.
                    </small>
                  </div>
                  <div className="metrics contact-metrics">
                    {[
                      ["call_click", "Phone link clicks"],
                      ["email_click", "Email link clicks"],
                      ["whatsapp_click", "WhatsApp link clicks"],
                    ].map(([key, label]) => (
                      <Metric
                        key={key}
                        label={label}
                        value={number(
                          gaRows.contacts?.find((r) => r.label === key)
                            ?.eventCount,
                        )}
                        description={
                          ga.status === "ready"
                            ? "Measured clicks · repeat clicks included"
                            : "Waiting for new Analytics data"
                        }
                      />
                    ))}
                  </div>
                  <Panel
                    eyebrow="HOW TO INTERPRET THIS"
                    title="Interest is not the same as an enquiry"
                  >
                    <div className="contact-explainer">
                      <Phone size={38} />
                      <div>
                        <h3>
                          A click is the start of a possible conversation.
                        </h3>
                        <p>
                          Clicking a phone, email or WhatsApp link does not tell
                          us whether someone called, sent a message, or became a
                          client. The dashboard does not read emails, telephone
                          conversations or client matter records.
                        </p>
                        <p>
                          For genuine enquiry-to-client reporting, a separately
                          approved business process would be needed. Nothing is
                          connected to your inbox or practice-management system
                          here.
                        </p>
                      </div>
                    </div>
                  </Panel>
                </>
              )}
              {section === "Site health" && (
                <>
                  <Panel
                    eyebrow="POINT-IN-TIME CHECKS"
                    title="Public pages & discovery files"
                  >
                    <div className="health-list">
                      {(report.health || []).map((item) => (
                        <div key={item.path}>
                          {item.ok ? (
                            <CheckCircle className="good" size={22} />
                          ) : (
                            <WarningCircle className="warn" size={22} />
                          )}
                          <a
                            href={`https://davetaxnz.nz${item.path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {
                              {
                                "/": "Homepage",
                                "/articles-media/": "Articles & media",
                                "/sitemap.xml": "Search sitemap",
                                "/privacy/": "Privacy page",
                              }[item.path]
                            }
                            <small>{item.path}</small>
                          </a>
                          <span>
                            {item.status === null
                              ? "Check unavailable"
                              : `HTTP ${item.status}`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="panel-footnote">
                      Checked when this report was retrieved; results can be
                      cached for up to one hour. A successful response does not
                      prove correct content, indexing, security or uptime.
                    </p>
                  </Panel>
                  <div className="two-up">
                    <Panel
                      eyebrow="OWNERSHIP & HISTORY"
                      title="Your website remains yours"
                    >
                      <p>
                        The public website and its repository are separate from
                        this read-only reporting workspace. Analytics
                        credentials stay on the reporting server.
                      </p>
                      <p>
                        Old Analytics data can be added later as a separately
                        labelled historical source once the correct account or
                        export is available. Overlapping property totals must
                        not be added together.
                      </p>
                    </Panel>
                    <Panel
                      eyebrow="REPORTING LIMITS"
                      title="What this does not monitor"
                    >
                      <ul className="plain-list">
                        <li>24/7 uptime, security incidents or malware.</li>
                        <li>
                          Google’s complete indexing and crawl diagnostics.
                        </li>
                        <li>
                          Inbox contents, legal matters or client records.
                        </li>
                        <li>
                          Revenue, confirmed enquiries or signed engagements.
                        </li>
                      </ul>
                      <a
                        className="text-link"
                        href="https://search.google.com/search-console?resource_id=sc-domain%3Adavetaxnz.nz"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Google Search Console <ArrowUpRight />
                      </a>
                    </Panel>
                  </div>
                </>
              )}
              {ga.partialPeriod && (
                <Note>
                  The selected Analytics period is shortened to the date
                  tracking began. A full like-for-like previous period is not
                  yet available.
                </Note>
              )}
              {(ga.thresholded || ga.sampled || ga.limited) && (
                <Note>
                  Google has{" "}
                  {ga.thresholded ? "applied privacy thresholds; " : ""}
                  {ga.sampled ? "sampled results; " : ""}
                  {ga.limited
                    ? "returned more rows than the 1,000-row display limit; "
                    : ""}
                  interpret detailed totals accordingly.
                </Note>
              )}
              <footer className="report-footer">
                <span>
                  <LockKey size={15} /> Private owner reporting · DaveTaxNZ
                </span>
                <span>Source-backed. Read-only. In your control.</span>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
