# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Selected direction

- The user selected visual option 3: a dark, high-contrast “Strategic Advocate” direction.
- Preserve the architectural editorial grid, vermilion action colour, warm paper content surface, large portrait-led hero, strong rules, and prominent regularly updated articles/media area.
- Use only verified claims and links from davetaxnz.nz; do not reproduce invented media logos or case figures from the concept image.
- Keep this project separate from the Timor-Leste Consulate repository.
- Keep third-party footer attribution visually subordinate to DaveTaxNZ. The approved Infinite Minds AI lockup sits at the bottom-right and uses a multiply treatment so the supplied white logo canvas blends into the warm paper background.
- Centre the “Powered by” label over the visible Infinite Minds logo while keeping the complete lockup anchored to the footer’s right edge.

## Owner-approved practice positioning

- Overseas New Zealand student-loan negotiation is Dave’s principal practice. Other IRD tax-debt negotiation is secondary and occasional.
- Do not market Dave for litigation, tax audits, GST or PAYE disputes, reassessments, investigations, general tax advice, accounting, tax-return preparation, or technical tax work.
- Use conditional wording such as “may”; Inland Revenue determines outcomes. Never guarantee remission, settlement, enforcement protection, border safety, or timing.
- DaveTaxNZ remains Dave’s personal professional information and media brand. Dave is presently a Partner at Meridian Partners, through which formal legal engagements are provided.
- Preserve existing davetaxnz.nz URLs and exact genuine testimonial wording. Do not invent client outcomes, media relationships, publication metadata, or professional titles.

## Client amendments — 25 August 2026

- Use “Tax Barrister” in the homepage hero profile line and portrait caption instead of “Former Inland Revenue Prosecutor”. The former prosecutor/adjudicator history may remain in substantive biography copy.
- In the student-loan return-risk and IRD enforcement cards, use: “Final determinations, processing timeframes, and decisions are at the discretion of Inland Revenue.”
- Keep `/student-loan-negotiations/` and `/ird-disputes-tax-penalties-negotiation/` as substantive practice-information pages, linked from the matching homepage sections; do not reduce these URLs to anchor redirects.
- Michael Bolton and Stewart C testimonials dated August 2026 are approved for the testimonial archive. Preserve their supplied wording exactly.
- The expanded biography includes Dave’s former adjudicator, Magistrate and Judicial Officer experience, Honorary Consul role, and RSE/trade work. Keep outcome, border, remission and enforcement wording conditional; do not publish “shield”, “secure outcomes”, or “border certainty” promises.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
