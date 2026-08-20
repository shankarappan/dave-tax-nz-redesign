# Article archive design QA

- Source visual truth: `/var/folders/n2/d96307fd2c91hg5g4xt_f24m0000gn/T/codex-clipboard-520463e3-ab11-454e-87c0-01e69c52f256.png`
- Implementation screenshot: `design-qa-comparison-article-grid.png` (right-hand panel)
- Side-by-side comparison: `design-qa-comparison-article-grid.png`
- State: Articles & Media Archive, default filters, first two article rows
- CSS viewport: 1323 × 690 at device scale factor 1
- Source pixels: 2646 × 1380, normalized to 1308 × 682 for comparison
- Implementation pixels: 1308 × 682

## Full-view comparison evidence

The reported layout used content-sized grid minimums, producing 307 px / 645 px / 307 px tracks. That made the centre card twice as wide as its neighbours and created visibly inconsistent headline wrapping, whitespace and vertical rules. The revised layout measures 396 px / 396 px / 396 px with consistent 36 px gutters and 390 px row heights. Tablet measures two equal 403.5 px tracks; mobile measures one 345 px track without horizontal overflow.

## Focused region comparison evidence

The first two archive rows were inspected at desktop and mobile sizes. Publication labels and dates share a baseline, headlines use a consistent optical size, summaries are constrained to four lines, category labels align above the action row, and actions remain evenly positioned. No separate asset comparison was needed because this archive grid contains no imagery or non-standard icons.

## Findings and comparison history

### Pass 1 — blocked

- [P1] Unequal desktop grid tracks made the archive look structurally broken.
  - Evidence: the first three cards measured 307.3 px, 645.3 px and 307.3 px.
  - Fix: changed the archive grid to `repeat(3, minmax(0, 1fr))` and set cards to `min-width: 0`.
- [P2] Card borders and padding were tied to a three-column `nth-child` pattern, which did not adapt cleanly at tablet and mobile breakpoints.
  - Fix: scoped archive cards to consistent gutter-based spacing with no internal vertical borders.
- [P2] Long summaries and headings could control track sizing and disrupt visual rhythm.
  - Fix: added safe wrapping, a restrained fluid headline size and a four-line summary clamp.

### Pass 2 — passed

- Desktop grid tracks are equal and aligned.
- Tablet and mobile breakpoints produce equal two-column and single-column layouts.
- Search returns `1 item` for “Malaysia”; the Student Loans filter returns `10 items`.
- The first article detail link navigates to the expected article page.
- A fresh browser verification reported zero console errors after adding the development render fallback.

## Required fidelity surfaces

- Fonts and typography: Existing Source Serif 4 and Libre Franklin families are preserved. Headline size, line height, wrapping and metadata weights are consistent across cards.
- Spacing and layout rhythm: Equal tracks, consistent gutters, aligned metadata, equal desktop row heights and responsive one/two/three-column transitions pass.
- Colors and visual tokens: Existing paper, ink, red, muted text and rule tokens remain unchanged and maintain the established editorial direction.
- Image quality and asset fidelity: Not applicable to the archive card grid; no visible image assets were removed or approximated.
- Copy and content: Article titles, summaries, dates, publication labels, categories and links are unchanged.

## Implementation checklist

- [x] Equalise desktop grid tracks.
- [x] Normalise card spacing and metadata alignment.
- [x] Constrain long copy without changing source text.
- [x] Verify tablet and mobile layouts.
- [x] Test search, subject filtering and article navigation.
- [x] Confirm a clean production build and browser console.

## Follow-up polish

No P0, P1 or P2 issues remain. Optional P3 work could add article thumbnails in a future, separately approved visual redesign.

final result: passed
