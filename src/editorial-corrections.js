// Reviewed public-profile corrections, 29 October 2026.
// Keep original routes and original publication text. These overrides survive a WordPress reimport.
const dates = {
  "ird-crackdown-overseas-student-loan-debt-davetaxnz": "2025-09-10",
  "dave-ananth-student-loan-enforcement-newstalk": "2025-07-04",
  "davetaxnz-student-loan-repayment-challenges": "2026-03-09",
  "tax-debt-enforcement-timing": "2026-02-17",
};
export function applyProfileAuditCorrections(article) {
  const originalDate = dates[article.slug];
  if (originalDate) article = { ...article, archivedDate: article.isoDate, isoDate: originalDate,
    date: new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(originalDate + "T00:00:00Z")),
    dateLabel: "Originally published" };
  if (article.slug === "nz-crypto-tax-disposals") article = { ...article,
    title: "NZ Crypto Tax Disposals: Why Trades and Swaps Can Trigger Tax",
    summary: "Crypto trades and swaps can create taxable disposals even when no money is withdrawn. Dave Ananth explains why transaction records and the circumstances of acquisition matter.",
    contentHtml: '<p><strong>Tax treatment:</strong> A disposal does not necessarily mean tax is payable. The applicable rules and individual facts matter. Where gains are taxable, acquisition costs, transaction fees and allowable losses must also be considered. Transfers between wallets you own are not disposals. See <a href="https://www.ird.govt.nz/cryptoassets/individual/buying-selling" target="_blank" rel="noopener noreferrer">Inland Revenue’s cryptoasset guidance</a>. The original published analysis follows.</p>' + article.contentHtml };
  if (article.slug === "ird-tax-debt-negotiation-beats-liquidation") article = { ...article,
    title: "IRD Tax Debt Negotiation: When It May Be an Alternative to Liquidation",
    summary: "For a viable business, a credible tax-debt proposal may offer an alternative to liquidation. The available options depend on the evidence, current compliance and Inland Revenue’s decisions." };
  return article;
}
