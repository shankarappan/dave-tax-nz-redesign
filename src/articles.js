import { clientMedia } from "./clientMedia.js";
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
    "slug": "three-news-student-loan-reform-dave-ananth",
    "subject": "Student Loans",
    "type": "Media Coverage",
    "publication": "Three News",
    "relationship": "Media coverage featuring Dave Ananth; broadcast segment approximately 0:43–4:09",
    "date": "30 August 2026",
    "isoDate": "2026-08-30",
    "title": "Three News: Student Loan Reform and Overseas Borrowers",
    "summary": "Dave Ananth appeared on Three News on 30 August 2026 to discuss proposed student-loan reforms and the treatment of overseas-based borrowers.",
    "sourceUrl": "https://players.brightcove.net/3812193411001/jUnZ8Sjxj_default/index.html?t=43&videoId=6404297244112",
    "videoEmbedUrl": "https://players.brightcove.net/3812193411001/jUnZ8Sjxj_default/index.html?t=43&videoId=6404297244112",
    "videoTitle": "Three News: Student Loan Reform and Overseas Borrowers — 30 August 2026",
    "videoCaption": "Three News broadcast, 30 August 2026. Player requests a start at 0:43; the relevant segment ends at approximately 4:09. The publisher’s player currently reports this video as unavailable; the written summary remains available below.",
    "contentHtml": "<h2>Broadcast summary</h2><p>Three News reported on proposed changes to New Zealand’s Student Loan Scheme in its broadcast on 30 August 2026. The report examined proposals intended to encourage graduates to remain in New Zealand while taking a stricter approach to overseas defaults. Dave Ananth appeared as a tax barrister and Partner at Meridian Partners specialising in overseas student-loan matters.</p><p>Dave acknowledged that student loans are taxpayer-funded obligations that must ultimately be addressed. His concern was about how a repayment policy works in practice. Simply increasing penalties may drive borrowers who have already disengaged further away from Inland Revenue, rather than encouraging renewed contact, repayment and compliance. The discussion placed that concern within the wider public debate about the proposed reforms.</p><p>This was independent national media coverage of Dave’s student-loan policy analysis. It was not an advertisement, a prediction about an individual borrower’s matter or an announcement that any particular proposal had become law. Borrowers should distinguish the policy discussion in the broadcast from the rules applying to their own circumstances and from any current IRD decision.</p><p>The embedded player is provided by Three News through Brightcove; the footage is not hosted by DaveTaxNZ. The relevant segment begins at approximately 0:43 and concludes at approximately 4:09. This written account is a summary, not a verbatim transcript. Three News remains the publisher and its inclusion does not imply endorsement of DaveTaxNZ or Meridian Partners. Formal legal services are provided through Meridian Partners, following the appropriate checks and engagement process.</p><h2>Practical points</h2><ul><li>Read the report in its original 30 August 2026 policy context.</li><li>Distinguish proposed reforms from rules applying to an individual matter.</li><li>Engagement with IRD and borrower compliance are central themes.</li><li>Media commentary does not predict an individual outcome.</li></ul><h2>Related information</h2><ul><li><a href=\"/student-loan-negotiations/\">Overseas student-loan advice</a></li><li><a href=\"/articles-media/section-145a-overseas-student-loan-debt/\">Section 145A and overseas student-loan debt</a></li><li><a href=\"/articles-media/can-ird-arrest-me-at-the-border-over-my-student-loan/\">Student-loan border enforcement</a></li><li><a href=\"/#about\">About Dave Ananth</a></li><li><a href=\"https://mplaw.nz/contact/\">Contact Meridian Partners</a></li><li><a href=\"/student-loan-airport-arrest-warrants/\">Student-loan arrest warrants and airport enforcement</a></li></ul><p><a class=\"button\" data-event=\"enquiry_click\" href=\"https://mplaw.nz/contact/?practice=student-loan-debt-ird-negotiation\">Discuss an overseas student-loan matter</a></p><p>Please keep your initial enquiry brief. Do not send detailed confidential information before conflict and engagement checks.</p><p>This material is general information only and is not legal or financial advice. Outcomes depend on the facts and the law applying to each matter. Past outcomes do not guarantee future results. Inland Revenue and the courts retain responsibility for their decisions.</p><p>DaveTaxNZ is Dave Ananth’s professional information and media platform. Formal legal services are provided through Meridian Partners.</p>",
    "mediaV8": true,
    "image": "/assets/articles/three-news-student-loan-reform-2026-08-30.jpg",
    "imageAlt": "Client-supplied screenshot of the Three News bulletin reporting on student-loan proposals.",
    "imageWidth": 1546,
    "imageHeight": 887,
    "videoThumbnail": "https://davetaxnz.nz/assets/articles/three-news-student-loan-reform-2026-08-30.jpg",
    "videoUploadDate": "2026-08-30"
  },
  { slug: "rnz-half-a-million-people-owe-tax", subject: "IRD Tax Debt", type: "Media Coverage", publication: "RNZ", relationship: "Coverage about tax debt and Inland Revenue", date: "11 August 2026", isoDate: "2026-08-11", title: "Over half a million people owe tax. How did this happen?", summary: "RNZ examines how tax debt accumulated and what Inland Revenue’s debt book means for taxpayers.", detailDescription: "RNZ examines the scale of New Zealand’s overdue-tax problem, why debt has accumulated across hundreds of thousands of taxpayers and how Inland Revenue is responding. The original RNZ report provides the full context for taxpayers facing arrears.", url: "https://www.rnz.co.nz/news/business/957513/over-half-a-million-people-owe-tax-how-did-this-happen" },
  { slug: "rnz-overdue-tax", subject: "IRD Tax Debt", type: "Media Interviews", publication: "RNZ", relationship: "Quotes Dave Ananth", date: "1 July 2026", isoDate: "2026-07-01", title: "What should you do about overdue tax?", summary: "RNZ reports on Inland Revenue enforcement and practical steps for taxpayers with overdue tax.", detailDescription: "RNZ outlines practical considerations for people with overdue tax, including engaging with Inland Revenue early and understanding possible repayment options. The original report contains the complete guidance and Dave Ananth’s comments.", url: "https://www.rnz.co.nz/news/personal-finance/650497/what-should-you-do-about-overdue-tax" },
  { slug: "interest-overseas-student-loans", subject: "Student Loans", type: "Media Coverage", publication: "Interest.co.nz", relationship: "Quotes Dave Ananth", date: "2026", isoDate: "2026", title: "Overseas student loan debt is keeping skilled Kiwis from returning home", summary: "Interest.co.nz reports on growing overseas student-loan balances and their effect on New Zealanders abroad.", detailDescription: "Interest.co.nz reports on the effect of growing overseas student-loan balances on skilled New Zealanders living abroad, including concerns about repayment obligations and returning home. The original article contains the full report and Dave Ananth’s comments.", url: "https://www.interest.co.nz/business/138466/dave-ananth-says-overseas-student-loan-problem-not-just-about-losing-money-its-also" },
];

const assembledArticles = [...wordpressArticles, ...externalArticles, ...homeVoiceArticles, ...clientMedia].sort((a, b) => b.isoDate.localeCompare(a.isoDate));

for (const article of assembledArticles) {
  if (article.language && article.language !== "English" && (!article.pdf || !article.image)) {
    throw new Error(`Non-English article ${article.slug} requires both its publication image and PDF.`);
  }
}

export const articles = assembledArticles;

export const subjects = ["Student Loans", "IRD Tax Debt", "Tax Policy", "Crypto Tax", "Other Commentary"];
export const mediaTypes = ["Articles by Dave", "Media Interviews", "Media Coverage", "Community Columns", "Podcasts"];
