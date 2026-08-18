# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Selected direction

- The user selected visual option 3: a dark, high-contrast “Strategic Advocate” direction.
- Preserve the architectural editorial grid, vermilion action colour, warm paper content surface, large portrait-led hero, strong rules, and prominent regularly updated articles/media area.
- Use only verified claims and links from davetaxnz.nz; do not reproduce invented media logos or case figures from the concept image.
- Keep this project separate from the Timor-Leste Consulate repository.

## Owner-approved practice positioning

- Overseas New Zealand student-loan negotiation is Dave’s principal practice. Other IRD tax-debt negotiation is secondary and occasional.
- Do not market Dave for litigation, tax audits, GST or PAYE disputes, reassessments, investigations, general tax advice, accounting, tax-return preparation, or technical tax work.
- Use conditional wording such as “may”; Inland Revenue determines outcomes. Never guarantee remission, settlement, enforcement protection, border safety, or timing.
- DaveTaxNZ remains Dave’s personal professional information and media brand. Dave is presently a Partner at Meridian Partners, through which formal legal engagements are provided.
- Preserve existing davetaxnz.nz URLs and exact genuine testimonial wording. Do not invent client outcomes, media relationships, publication metadata, or professional titles.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
