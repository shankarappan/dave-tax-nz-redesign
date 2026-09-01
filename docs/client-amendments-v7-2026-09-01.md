# Client amendments V.7 — 1 September 2026

Source: `DAVETAX WEBSITE AMENDMENTS V.7.docx`, supplied by the user. Both rendered pages, underlying hyperlink, embedded examples and listed requirements were reviewed. The document contains no tracked changes or comments.

## Implemented

- The four listed Chinese-language Home Voice records now use a **Read PDF** action. It opens the publication PDF in a new browser tab and does not set a download attribute.
- The article data now records `language: "Chinese"`. The detail-page action applies the Read PDF behaviour to any future article whose language is recorded as something other than English. The production build rejects a non-English record unless both its publication image and PDF are provided.
- Added the separately supplied one-page PDF for “The True Cost of Family Labor: Why Your Business Might Not Be Making Money After All.” The source PDF was copied without modification.
- Added the three separately supplied JPEG publication scans to the matching View details pages: Safeguarding Your Legacy; Mortgage-Free House and Gold Coins; and Vegetable Boxes, Cabbage Leaves and Tax Records.
- Publication scans use the existing document-image presentation so their complete portrait pages remain visible without cropping on desktop and mobile.

## Source-asset integrity

The supplied images and PDF are published byte-for-byte without retouching, cropping, OCR or content changes. The existing three PDF files remain unchanged. All original English summaries, metadata, source links and article URLs remain unchanged.

The new PDF's filename says Issue 1392 while its visible publication header says Issue 1389. The website uses a neutral asset filename and does not assert either issue number for this record. Its agreed publication date and page remain 28 August 2026, page 2.

No homepage positioning, contact information, analytics, private dashboard, DNS, Cloudflare Access, email or security configuration changed.

## Rollback

Revert this V.7 publication update through the normal website release process. The previous release remains available in Git history; no infrastructure rollback is needed.
