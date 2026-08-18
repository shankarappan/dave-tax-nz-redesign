# Updating articles and media

The archive's single source is `src/articles.js`. Each item has an exact source URL plus separate `subject` and `type` values. This separation powers both archive filters.

Before adding an item, obtain the publisher URL and confirm the exact title, publication date, publication name and Dave's relationship to the source. Do not infer “interviewed”, “quoted”, “written by” or a case outcome.

1. Duplicate one existing object in `src/articles.js`.
2. Give it a unique lowercase `slug` using hyphens.
3. Choose one approved Subject and one approved Type from the exported lists at the end of the file.
4. Copy the publisher title and URL exactly.
5. Write a neutral summary that does not introduce a new claim.
6. Run `npm run build` and check the homepage, archive, filters and generated detail route.
7. Obtain Dave or Pam's approval before publishing.

The build automatically produces a substantive HTML route at `/articles-media/<slug>/`. A future CMS, spreadsheet or media-monitor automation can replace this file without changing the archive UI, provided it emits the same fields and retains human approval before publication.
