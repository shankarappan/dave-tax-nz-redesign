# DaveTaxNZ owner insights

Private, read-only owner reporting. React/Vite frontend, Cloudflare Worker backend, Google Search Console and Google Analytics Data APIs. Uses DaveTaxNZ’s charcoal, warm-paper, red and serif/sans theme. Fonts are bundled locally (Libre Franklin and Source Serif 4, SIL Open Font License via Fontsource); no third-party browser reporting scripts run in this dashboard.

## Status — 31 August 2026

Implemented and locally tested against the authorised Search Console connection. GA4 property `552154177` is connected; the new tag was published and verified on 31 August 2026, alongside the original tag. Completed-day reporting starts from this date, subject to Google's processing delay; actual event ingestion has not yet been confirmed. Cloudflare Access is now enabled, but the owner email allowlist awaits confirmation, so **this dashboard is not publicly deployed**. Blank Access configuration intentionally returns HTTP 503, even for static assets. Do not describe untested production authentication as verified.

The public website still uses GitHub Pages behind Cloudflare. This subproject does not replace it, change its DNS, or touch WordPress or email. The repository remains on GitHub; deploying a Worker does not move the repository into Cloudflare.

## What the owner gets

- Overview: search clicks/impressions and new-property Analytics visitors/page views, source dates and availability.
- Google search: query/page tables, sortable columns, search and CSV export.
- Articles: all published catalogue entries, matched to their DaveTaxNZ detail URLs. No invented publisher readership.
- Audience: country, device and acquisition channel; aggregate data, no visitor profiles.
- Contact activity: phone/email/WhatsApp link clicks, explicitly not completed enquiries.
- Site health: four point-in-time HTTP checks, not a security or uptime audit.
- 7-, 28- and 90-day periods; mobile navigation, keyboard focus, reduced-motion support and textual chart values.

The screen never calls Google directly. CSV downloads contain only the displayed, filtered rows; formula-like cells are neutralised. Downloads are sensitive owner reports and should be handled accordingly.

## Local development

```sh
cd insights
npm ci
npm run build
npm run dev
```

The development adapter binds only `127.0.0.1:4178`. It checks Host, Origin and Fetch Metadata and reads the existing private service-account file from the sibling `.private-davetax-reporting` directory. It uses live reports, not demo figures. That adapter is **not imported by the production Worker**. Do not expose it using a public tunnel. Its response is labelled local preview. The production Worker has no authentication-bypass switch.

```sh
WRANGLER_LOG_PATH=./.wrangler/logs npm run types
npm run check
npm test
npm run build
WRANGLER_LOG_PATH=./.wrangler/logs npm run deploy:check
```

Worker types are generated from Wrangler config, including required secret names. The dry run bundles locally; it does not publish. Root `npm run build && npm run test:sites` still builds and tests the public website independently.

## Security boundary and deployment gate

Before production deployment:

1. The client enables **Cloudflare Zero Trust / Access Free**. Do not activate a paid plan or billing on their behalf.
2. Confirm the exact owner email allowlist. Create a self-hosted Access application for `insights.davetaxnz.nz`, covering all paths. Permit only those identities, using the agreed Google identity provider or email OTP; use a session duration no greater than 24 hours. Do not add Everyone, Bypass, wildcard-domain or service-token policies. Email OTP is not equivalent to enforced MFA; require stronger IdP controls if the client's policy requires MFA.
3. Put the actual Access team hostname and application AUD in `wrangler.jsonc`. Keep Google credentials and `ALLOWED_EMAILS` in Worker secrets, never frontend environment variables. Use the existing service account with only GA property Viewer and Search Console Restricted access; no project-level roles, new keys or domain-wide delegation are required.
4. Set `GA_COLLECTION_START` to the verified publication date of the new tag. A blank value reports awaiting installation and does not query GA. This is not the date of the original website migration.
5. Deploy the Worker with **no public route** first. `workers_dev:false`, `preview_urls:false` and `assets.run_worker_first:true` must remain. Then add the one custom domain only after the matching Access policy exists. Do not modify apex, www, MX, SPF, DKIM, DMARC or WordPress records.
6. Verify unauthenticated homepage/assets/API redirect to Access or deny; approved identities can view all sections; an unapproved identity is denied; logout revokes the browser session. Test expired, wrong-AUD and forged JWTs, direct Worker paths and GET/HEAD-only APIs. Confirm all report responses use `Cache-Control: no-store` and no data is accessible through the Worker preview hostname.
7. Verify desktop/mobile layouts and real browser flows, then record the deployed version, identity policy, reviewers, timestamp and rollback baseline in the private setup notes. Local unit tests are not a substitute for end-to-end production login testing.

The Worker independently verifies Access JWT signature (RS256), issuer, audience, expiry, issued-at/max-age and email allowlist before accessing a cache, an asset or a report. It does not trust the plain email header. Unknown hosts fail; missing config fails closed. There are no content-writing, DNS, email, arbitrary-proxy or delete APIs.

The only runtime secret with data access is the Google reporting service account. It is not a Cloudflare admin credential. Google OAuth scopes are `analytics.readonly` and `webmasters.readonly`. Requests are made to fixed providers/properties, with bounded parallelism, timeouts, schema checks and a 2 MB response limit. Raw provider errors, search queries, JWTs and keys are not logged.

Authenticated report payloads can be cached for up to an hour in Cloudflare Cache API. Authentication is checked before every cache read. No browser caching is allowed. No public cache URL serves those reports. HTTP security headers include CSP, frame denial, no-referrer, nosniff, short host-only HSTS and noindex. These controls reduce risk; they do not establish zero risk or regulatory certification.

Free-tier usage limits still apply. Reports are fetched on demand, not with a paid scheduler. Review Worker/API quota errors and usage before increasing access or adding background work. Browser reload may return a cached report; the displayed retrieval timestamp remains the actual snapshot time.

## Metric and historical-data contract

- Search: final Google Web Search data, restricted to apex/www DaveTaxNZ URLs. Pacific-time calendar, with a conservative lag. Daily rows and top 1,000 detail rows are separate queries. Anonymised queries and provider limits mean detail rows need not sum to totals. Averages/CTR are provider aggregates, not averages of averages.
- Analytics: the new property only, Auckland-time days ending yesterday. Reporting begins on the tag publication date. Partial periods are labelled. Previous-period comparisons appear only when the whole prior period is covered. There may still be processing delay for recent days.
- Users are GA `activeUsers`, page views are `screenPageViews`, contact counts are `eventCount`. Country/device users must not be summed to infer unique users. No property totals are combined.
- A missing response is unavailable, not zero. A successful provider response with an explicit zero can display zero. Absent article rows display a dash. Provider errors remain visible.
- Article matching combines apex/www and trailing-slash variants, summing clicks/impressions/views only. It does not add distinct-user counts or automatically combine old WordPress and new article URLs. The Search pages table exposes legacy paths separately.
- Search Console’s domain history can span both websites. The old GA measurement ID `G-HN792X0368` is retained on the public site. Access to that property's history is still unconfirmed.
- Later historical imports must include original property ID, metric definitions, date range, timezone, export time and source. Present old/new series separately, label the migration and collection-start boundaries, exclude overlap from combined totals, and validate compatibility before a comparison. No historical import or GA property merge has been implemented yet.

## Rollback and ownership

To withdraw dashboard access, disable its Access allow policy or remove the reporting custom domain. Keep denial protection in place; never remove Access while leaving a data-serving route. Restore the prior Worker version/config if needed. Revoking the reporting service-account permissions on its Google properties stops future permitted API reads, but cached reports can remain for up to an hour; disable owner access and purge the private cache when immediate data-access removal is required. Existing OAuth tokens can remain valid until expiry when only a key is revoked.

The public tracking change is one new `gtag('config', 'G-S4BDKMVWDC', …)` plus its privacy-limited URL fields. Revert that addition through the repository's normal reviewed release path; keep the existing tag, property and history. Reverting tracking does not delete already-collected data.

Deploying the private reporting service does not grant an AI agent content-editor rights, repository ownership or access to customer records. Future content automation requires a separate approved design and permissions; it is not part of this dashboard.

## Primary references

- [Cloudflare: validate Access JWTs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Google Analytics: tag configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
- [Google Search Console: Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Cloudflare: Worker configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
