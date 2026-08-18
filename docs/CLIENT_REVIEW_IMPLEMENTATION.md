# Client review implementation record

Status: staging only. Do not point `davetaxnz.nz`, delete the current WordPress site, or enable indexing until Dave and Pam approve the content, legal wording, privacy details, URL inventory, redirects and cutover plan.

## Implemented in this staging revision

- Correct mobile display and `tel:+642102168888` destination everywhere.
- WhatsApp links use `https://wa.me/642102168888`; email links use `mailto:dave@davetaxnz.nz`.
- DaveTaxNZ described as Dave's personal professional information, publication and media platform; formal services are through Meridian Partners.
- Student loans identified as the principal specialist practice.
- Secondary practice renamed “Selected IRD tax-debt matters” using Dave's supplied scope verbatim.
- Homepage archive limited to six items. A separate searchable archive has independent Subject and Type filters.
- Individual internal media-record routes include the source relationship, date, publication and external original-source link.
- Three homepage testimonial excerpts are kept exact and uncombined, with a nearby past-results disclaimer.
- Terms, Privacy and Legal & Engagement Disclaimer routes added as staging drafts. Unknown privacy-provider facts are visibly marked for client confirmation.
- External publisher links open a new tab; internal navigation stays in the same tab.
- Every route is prerendered into substantive HTML. The content remains readable with JavaScript disabled; JavaScript enhances filtering and the mobile menu.
- Staging is `noindex, nofollow` with a blocking `robots.txt`.
- Google Analytics ID `G-HN792X0368` is present but activates only on the final `davetaxnz.nz` hostname. Events contain only event name and page path, never form-entered data.
- Custom 404 route generated.

## Content and claims held for approval

- Full testimonial text and source screenshots.
- Home Voice English/Chinese wording, scans, issue date and page references.
- Final publication logo selection and order. Current supplied lockup remains unchanged.
- Any claim that Dave was interviewed, quoted or featured beyond an exact verified source relationship.
- Final legal and privacy wording.

## Required before production cutover

- Dave/Pam written approval of all public copy, professional claims, testimonials and media relationships.
- Meridian Partners approval of engagement wording, recipient mailbox and privacy/legal pages.
- Complete WordPress export or sitemap and media library backup; reconcile it against `URL_MAP.csv`.
- Confirm booking/form provider, delivery recipient, authorised users, storage, retention, deletion, overseas processing, spam protection, acknowledgement wording and failure handling.
- Genuine desktop and mobile test submissions to a client-controlled test inbox.
- Search Console access, domain verification, final production sitemap and indexing request.
- Ownership/access list for domain registrar, DNS, hosting, GitHub, analytics, email/form and Search Console; require 2FA where available.
- Security-header configuration on the chosen production host, uptime/form monitoring, backups and a tested restoration procedure.
- Agreed cutover window and rollback owner. Keep the existing site and its database/media backup recoverable.

## Rollback outline

1. Export the existing site, database, media and DNS records before changing anything.
2. Record the existing origin and TTL values; reduce TTL only after approval.
3. Deploy and verify the approved release on staging, including redirects and real form delivery.
4. Change only the necessary DNS record during the agreed window.
5. Monitor HTTPS, forms, top URLs, redirects and analytics.
6. If a critical fault appears, restore the recorded DNS origin and verify the old site before closing the incident.

