import { wordpressArticles } from "./wordpressArticles.js";
import { homeVoiceArticles } from "./homeVoiceArticles.js";

// External records that were never standalone DaveTaxNZ WordPress posts.
// Keep publisher titles, dates and source URLs exact.
const externalArticles = [
  {
    slug: "spinoff-overseas-student-loan-explainer",
    subject: "Student Loans",
    type: "Media Coverage",
    publication: "The Spinoff",
    relationship: "Video explainer referencing Dave Ananth’s guidance",
    date: "2 September 2026",
    isoDate: "2026-09-02",
    title: "What happens if you leave NZ with a student loan?",
    summary: "The Spinoff explains how overseas-borrower interest can increase a New Zealand student loan and cites Dave Ananth’s advice to engage with IRD before returning to New Zealand.",
    sourceUrl: "https://www.youtube.com/watch?v=OhB5QYMllL4",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/OhB5QYMllL4?rel=0",
    videoTitle: "What happens if you leave NZ with a student loan? — The Spinoff",
    videoPresentation: "portrait",
    contentHtml: `<h2>Video summary</h2><p>In this short explainer, The Spinoff outlines how moving overseas changes the treatment of a New Zealand student loan. The video says overseas-borrower interest can apply after 152 consecutive days away and be backdated to the day after departure. It illustrates how compounding interest and late-payment interest can cause an unpaid balance to grow substantially over time.</p><p>The video references Dave Ananth’s practical guidance for overseas borrowers: if you have overdue New Zealand student-loan debt and are planning to return to New Zealand, engage with Inland Revenue before you travel rather than ignoring the debt.</p><h2>Figures stated in the video</h2><p>As published on 2 September 2026, the video states an overseas-borrower interest rate of 5.6%, a late-payment interest rate of 9.6% on overdue repayments, and approximately 115,000 overseas-based borrowers collectively owing $4.5 billion. Rates, thresholds and Inland Revenue policy can change, so borrowers should verify the current rules and obtain advice for their circumstances.</p>`,
  },
  {
    slug: "section-145a-overseas-student-loan-debt",
    subject: "Student Loans",
    type: "Articles by Dave",
    publication: "Interest.co.nz",
    author: "Dave Ananth",
    relationship: "Opinion article written by Dave Ananth",
    date: "31 August 2026",
    isoDate: "2026-08-31",
    title: "Dave Ananth reveals how new section 145A of the Student Loan Scheme Act works to resolve longstanding ballooned student loan debt owed by borrowers who are now overseas",
    summary: "Dave Ananth explains section 145A and the role of financial disclosure and realistic repayment proposals in resolving overseas student-loan debt.",
    sourceUrl: "https://www.interest.co.nz/personal-finance/140036/dave-ananth-reveals-how-new-section-145a-student-loan-scheme-act-works",
    image: "/assets/articles/section-145a-student-loan-arrangement.jpg",
    imageAlt: "Illustration of a student-loan repayment arrangement and a key, supplied with the Interest.co.nz article summary.",
    imageWidth: 1033,
    imageHeight: 563,
    contentHtml: `<h2>Article summary</h2><p>In an opinion article published by interest.co.nz, tax specialist Dave Ananth explains how section 145A of the Student Loan Scheme Act 2011 provides a practical mechanism for the Inland Revenue Department (IRD) to resolve ballooning student loan debts owed by overseas-based borrowers. Highlighting that IRD made 73,732 file referrals to overseas debt collectors between the 2022/23 and 2025/26 financial years, Ananth notes that while enforcement creates pressure, traditional recovery methods often yield low returns on decades-old debts.</p><p>He explains that under section 145A—in conjunction with related statutory provisions—the Commissioner now holds discretionary power to write off equitable amounts of ordinary loan interest and cancel accrued interest once a borrower re-engages, makes a full financial disclosure, and agrees to a realistic lump-sum or instalment settlement. Emphasizing that this measure is not an automatic discount or amnesty, Ananth shares from his practical experience that when borrowers transparently provide their financial details and a serious proposal, the Crown can successfully collect substantial funds that might otherwise remain unrecoverable while helping individuals permanently resolve their historical debt.</p>`,
  },
  {
    slug: "three-news-student-loan-reform-dave-ananth",
    subject: "Student Loans",
    type: "Media Coverage",
    publication: "Three News",
    relationship: "Media coverage featuring Dave Ananth; broadcast segment 0:43–4:09",
    date: "30 August 2026",
    isoDate: "2026-08-30",
    title: "Media Coverage (Three News): National’s Student Loan Reform & Industry Analysis featuring Dave Ananth",
    summary: "Three News covers National’s proposed student-loan reforms, featuring Dave Ananth’s comments on overseas debt and borrower engagement.",
    sourceUrl: "https://www.threenow.co.nz/shows/three-news/sunday-30-august-2026/1717556442294/mac_11933796",
    image: "/assets/articles/three-news-student-loan-reform-2026-08-30.jpg",
    imageAlt: "Client-supplied screenshot of the Three News bulletin reporting on National’s student-loan proposals.",
    imageWidth: 1546,
    imageHeight: 887,
    videoEmbedUrl: "https://players.brightcove.net/3812193411001/jUnZ8Sjxj_default/index.html?videoId=6404297244112&t=43",
    videoTitle: "Three News coverage featuring Dave Ananth",
    videoCaption: "Official ThreeNow player. Playback opens at 0:43; Dave Ananth’s segment concludes at 4:09.",
    contentHtml: `<h2>Broadcast summary</h2><p>The National Party's latest policy announcement—termed the "Back Pocket Boost for Graduates”, proposes structural changes to the Student Loan Scheme if re-elected. Media reporting highlights a two-tiered strategy aimed at incentivizing graduates to remain in New Zealand while taking a stricter stance on overseas defaults.</p><p>In the segment from 0:43 to 4:09 of the Three News bulletin (available to view at ThreeNow), Dave Ananth, tax barrister and specialist on overseas student loan debt at Meridian Partners, emphasizes that while student loan debt is taxpayer-funded and must ultimately be settled, increasing penalties for overseas borrowers is counterproductive if it drives further disengagement.</p>`,
  },
  { slug: "rnz-half-a-million-people-owe-tax", subject: "IRD Tax Debt", type: "Media Coverage", publication: "RNZ", relationship: "Coverage about tax debt and Inland Revenue", date: "11 August 2026", isoDate: "2026-08-11", title: "Over half a million people owe tax. How did this happen?", summary: "RNZ examines how tax debt accumulated and what Inland Revenue’s debt book means for taxpayers.", detailDescription: "RNZ examines the scale of New Zealand’s overdue-tax problem, why debt has accumulated across hundreds of thousands of taxpayers and how Inland Revenue is responding. The original RNZ report provides the full context for taxpayers facing arrears.", url: "https://www.rnz.co.nz/news/business/957513/over-half-a-million-people-owe-tax-how-did-this-happen" },
  { slug: "rnz-overdue-tax", subject: "IRD Tax Debt", type: "Media Interviews", publication: "RNZ", relationship: "Quotes Dave Ananth", date: "1 July 2026", isoDate: "2026-07-01", title: "What should you do about overdue tax?", summary: "RNZ reports on Inland Revenue enforcement and practical steps for taxpayers with overdue tax.", detailDescription: "RNZ outlines practical considerations for people with overdue tax, including engaging with Inland Revenue early and understanding possible repayment options. The original report contains the complete guidance and Dave Ananth’s comments.", url: "https://www.rnz.co.nz/news/personal-finance/650497/what-should-you-do-about-overdue-tax" },
  { slug: "interest-overseas-student-loans", subject: "Student Loans", type: "Media Coverage", publication: "Interest.co.nz", relationship: "Quotes Dave Ananth", date: "2026", isoDate: "2026", title: "Overseas student loan debt is keeping skilled Kiwis from returning home", summary: "Interest.co.nz reports on growing overseas student-loan balances and their effect on New Zealanders abroad.", detailDescription: "Interest.co.nz reports on the effect of growing overseas student-loan balances on skilled New Zealanders living abroad, including concerns about repayment obligations and returning home. The original article contains the full report and Dave Ananth’s comments.", url: "https://www.interest.co.nz/business/138466/dave-ananth-says-overseas-student-loan-problem-not-just-about-losing-money-its-also" },
];

const assembledArticles = [...wordpressArticles, ...externalArticles, ...homeVoiceArticles].sort((a, b) => b.isoDate.localeCompare(a.isoDate));

for (const article of assembledArticles) {
  if (article.language && article.language !== "English" && (!article.pdf || !article.image)) {
    throw new Error(`Non-English article ${article.slug} requires both its publication image and PDF.`);
  }
}

export const articles = assembledArticles;

export const subjects = ["Student Loans", "IRD Tax Debt", "Tax Policy", "Crypto Tax", "Other Commentary"];
export const mediaTypes = ["Articles by Dave", "Media Interviews", "Media Coverage", "Community Columns", "Podcasts"];
