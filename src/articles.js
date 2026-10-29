import { clientMedia } from "./clientMedia.js";
import { applyProfileAuditCorrections } from "./editorial-corrections.js";
import { wordpressArticles } from "./wordpressArticles.js";
import { homeVoiceArticles } from "./homeVoiceArticles.js";

// External records that were never standalone DaveTaxNZ WordPress posts.
// Keep publisher titles, dates and source URLs exact.
const externalArticles = [
  {"slug": "education-post-student-loan-debt-relief", "subject": "Student Loans", "type": "Media Coverage", "publication": "Education Post", "author": "Amin Masoodi", "relationship": "Education Post reporting featuring Dave Ananth’s RNZ comments; Dave is not the author", "date": "28 October 2026", "isoDate": "2026-10-28", "title": "New Zealand lawyer secures $100,000 student loan debt relief", "summary": "Education Post reports on Dave Ananth’s overseas student-loan work following his RNZ Nine to Noon interview.", "detailDescription": "Education Post reports on Dave Ananth’s overseas student-loan work following his RNZ Nine to Noon interview.", "sourceUrl": "https://educationpost.in/news/global-education/new-zealand-lawyer-secures-100000-student-loan-debt-relief"},
  {
    slug: "returning-new-zealand-old-student-loan-five-things",
    subject: "Student Loans",
    type: "Articles by Dave",
    publication: "DaveTaxNZ",
    author: "Dave Ananth",
    relationship: "Original article written by Dave Ananth",
    date: "27 September 2026",
    isoDate: "2026-09-27",
    title: "Returning to New Zealand With an Old Student Loan? Do These Five Things Before You Book Your Flight",
    summary: "An old student loan does not mean you will be arrested at the airport. But if you have been overseas for years, have lost contact with Inland Revenue, and are now planning to come back to New Zealand, guessing is not a plan.",
    image: "/assets/articles/returning-new-zealand-old-student-loan-2026-09-27.jpg",
    imageAlt: "Traveller with luggage looking across Auckland Airport towards an Air New Zealand aircraft and the Auckland skyline.",
    imageWidth: 508,
    imageHeight: 508,
    contentHtml: `<p>An old student loan does not mean you will be arrested at the airport.</p><p>But if you have been overseas for years, have lost contact with Inland Revenue, and are now planning to come back to New Zealand, guessing is not a plan.</p><p>The problem is often not just the balance. It is the history: missed assessments, old correspondence, penalties and interest, previous discussions with Inland Revenue, and whether any enforcement steps have already been taken.</p><h2>Before you book your flight, do these five things.</h2><h3>1. Get the full loan history.</h3><p>Do not rely on the figure you remember borrowing twenty years ago, or even on a balance without context.</p><h3>2. Collect every letter, email and previous payment proposal.</h3><p>The detail matters. It may show what Inland Revenue knew, what was sent, and what was previously discussed.</p><p>If you cannot access myIR, do not know how to obtain the history, or no longer have the documents, call me. We can start there.</p><h3>3. Be clear about your travel plans.</h3><p>The date of travel, how long you intend to stay, and your prior contact with Inland Revenue can all matter.</p><h3>4. Do not assume a token payment or one phone call resolves the position.</h3><p>It may be sensible to engage. But it must be done with a proper understanding of the file, not as a last-minute gesture.</p><h3>5. Get the position assessed before travelling.</h3><p>There is no simple public online warrant-checking service, and no lawyer can guarantee an airport outcome. But the history can be reviewed, the right questions can be asked, and a practical approach can be prepared before travel.</p><p>If you have an old overseas student-loan debt and are considering returning to New Zealand, <a href="/#contact">contact Dave Ananth</a> to arrange a short initial call before making travel plans.</p>`,
  },
  {
    slug: "labours-583m-student-debt-deal-australian-pay",
    subject: "Student Loans",
    type: "Media Coverage",
    publication: "Newsroom",
    author: "Alice Peacock",
    relationship: "Written Newsroom coverage featuring Dave Ananth’s comments",
    date: "29 September 2026",
    isoDate: "2026-09-29",
    title: "Labour’s $583m student debt deal fails to blunt lure of Australian pay",
    summary: "Labour’s proposed election policy to cut New Zealand-based graduates’ student loan debt by 10 percent (and fully wipe balances under $2,000) aims to retain young talent, but critics argue the $583.4 million initiative will do little to stem the outflow of workers to Australia.",
    sourceUrl: "https://newsroom.co.nz/2026/09/29/labours-583m-student-debt-deal-fails-to-blunt-lure-of-australian-pay/",
    contentHtml: `<h2>Article summary</h2><p>Labour’s proposed election policy to cut New Zealand-based graduates’ student loan debt by 10 percent (and fully wipe balances under $2,000) aims to retain young talent, but critics argue the $583.4 million initiative will do little to stem the outflow of workers to Australia. Under the plan, graduates must stay in New Zealand for three years and have not received Fees Free benefits to qualify. However, student leaders and economists note that high domestic youth unemployment and significantly higher salary prospects in Australia—often $10,000 to $20,000 more annually—far outweigh the modest savings of a 10 percent debt discount. Meanwhile, political opponents label the proposal an expensive handout that unfairly excludes tradespeople and recent Fees Free recipients while benefiting earlier, higher-earning graduates.</p><p>Crucially, the policy fails to address what tax expert Dave Ananth describes as the "elephant in the room": the growing $2.49 billion in overdue student debt held by over 113,000 Kiwis living abroad. Ananth, who assists overseas-based borrowers negotiating with Inland Revenue, points out that compounding penalties often cause individual loan balances to balloon to upwards of $150,000. He argues that instead of blanket domestic discounts, the government should actively engage overseas debtors through a pragmatic, commercial, case-by-case approach to help recover unpaid funds.</p>`,
  },
  {
    slug: "the-panel-sue-bradford-david-farrar-dave-ananth",
    subject: "Student Loans",
    type: "Podcasts",
    publication: "RNZ · The Panel",
    relationship: "Radio interview featuring Dave Ananth; panellists Sue Bradford and David Farrar",
    date: "17 September 2026",
    isoDate: "2026-09-17",
    title: "The Panel with Sue Bradford and David Farrar – featuring Dave Ananth",
    summary: "RNZ’s The Panel interviews Dave Ananth about proposed changes to border enforcement for overseas student-loan defaulters.",
    sourceUrl: "https://www.rnz.co.nz/national/programmes/thepanel/audio/2019052346/the-panel-with-sue-bradford-and-david-farrar",
    image: "/assets/articles/rnz-the-panel-student-loan-2026-09-17.png",
    imageAlt: "RNZ page for The Panel with Sue Bradford and David Farrar, published 17 September 2026.",
    imageWidth: 1105,
    imageHeight: 737,
    contentHtml: `<h2>Panellists</h2><p>Sue Bradford and David Farrar</p><h2>Audio summary</h2><p>In this <a href="https://www.rnz.co.nz/national/programmes/thepanel/audio/2019052346/the-panel-with-sue-bradford-and-david-farrar" target="_blank" rel="noopener noreferrer">audio segment (33:30–40:15)</a> on RNZ’s The Panel, hosts Sue Bradford and David Farrar interview tax lawyer Dave Ananth about proposed tax law changes aimed at overseas student loan defaulters. The proposed legislation would lower the threshold for Inland Revenue to arrest defaulting expats at the New Zealand border by removing the strict requirement to prove formal delivery of default notices. Ananth warns that the fear of border arrest will cause expats to avoid returning home entirely, while compounding interest and outdated contact details make resolution difficult. Panelist Sue Bradford echoes concerns that punitive measures punish struggling Kiwis and alienate the diaspora, whereas David Farrar argues that strict enforcement is necessary to protect taxpayers and recover billions in unpaid debt.</p>`,
  },
  {
    slug: "expats-owing-student-debt-higher-risk-arrest",
    subject: "Student Loans",
    type: "Media Coverage",
    publication: "Newsroom",
    author: "Alice Peacock",
    relationship: "Newsroom coverage featuring Dave Ananth’s comments",
    date: "16 September 2026",
    isoDate: "2026-09-16",
    title: "Expats Owing Student Debt Face New, Higher Risk of Arrest: Amendment to tax bill would let Inland Revenue pursue arrest warrants without having to prove a default notice was delivered",
    summary: "Newsroom reports on a proposed amendment that could let Inland Revenue seek arrest warrants without proving a default notice was delivered.",
    sourceUrl: "https://newsroom.co.nz/2026/09/16/expats-owing-student-debt-face-higher-risk-of-arrest-under-proposed-changes/",
    image: "/assets/articles/newsroom-student-loan-arrest-2026-09-16.jpg",
    imageAlt: "Traveller with luggage approaching an airport border checkpoint, supplied with the Newsroom article summary.",
    imageWidth: 1059,
    imageHeight: 706,
    contentHtml: `<h2>Article summary</h2><p>Written by Alice Peacock for Newsroom, a recent article details a proposed amendment to the Taxation Act that would grant Inland Revenue the power to apply for border arrest warrants without needing to formally prove that a default notice was successfully delivered to an overseas borrower, relying instead on past interactions to establish willful non-compliance.</p><p>While Revenue Minister Simon Watts defended the measure by emphasizing that taxpayer-funded student loans must be repaid and that individual cases will still be assessed carefully, tax negotiator Dave Ananth raised concerns that the changes could backfire. Ananth warned that the fear of arrest might cause overwhelmed expats who want to engage—such as those who missed notices due to illness or changed contact details—to put their heads in the sand and go further underground rather than seeking help. The article highlights the growing scale of the issue, noting that overseas-based borrowers account for $4.5 billion of total student loan debt—with $2.49 billion overdue and compliance sitting at just 32.1%—prompting Inland Revenue to steadily ramp up international enforcement and border warnings.</p>`,
  },
  {
    slug: "student-loan-arrest-warrants-new-tax-bill",
    subject: "Student Loans",
    type: "Articles by Dave",
    publication: "Interest.co.nz",
    author: "Dave Ananth",
    relationship: "Opinion article written by Dave Ananth",
    date: "14 September 2026",
    isoDate: "2026-09-14",
    title: "Student Loan Arrest Warrants Might Become Easier Under a New Tax Bill",
    summary: "Dave Ananth examines whether proposed student-loan enforcement wording matches the Government’s stated target.",
    sourceUrl: "https://www.interest.co.nz/personal-finance/140239/dave-ananth-examines-proposed-change-overseas-student-loan-enforcement-and",
    image: "/assets/articles/interest-student-loan-arrest-warrants-2026-09-14.jpg",
    imageAlt: "Traveller holding a New Zealand passport at an airport immigration checkpoint, supplied with the Interest.co.nz article summary.",
    imageWidth: 1432,
    imageHeight: 955,
    contentHtml: `<h2>Article summary</h2><p>In an opinion piece published on Interest.co.nz, tax specialist Dave Ananth examined the proposed tax bill changes regarding overseas student loan enforcement, asking whether the statutory wording matches the Government’s stated target of punishing only those who deliberately avoid communication. Pointing out that Revenue Minister Simon Watts specifically highlighted borrowers "deliberately avoiding Inland Revenue communications," Ananth noted that the proposed clause does not actually require proof of deliberate avoidance, writing:</p><blockquote><p>"Revenue Minister Simon Watts has identified his target: overseas student loan borrowers who deliberately avoid Inland Revenue communications. A change Parliament has been asked to pass does not expressly require deliberate avoidance to be proved."</p></blockquote>`,
  },
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
    "contentHtml": "<h2>Broadcast summary</h2><p>Three News reported on proposed changes to New Zealand’s Student Loan Scheme in its broadcast on 30 August 2026. The report examined proposals intended to encourage graduates to remain in New Zealand while taking a stricter approach to overseas defaults. Dave Ananth appeared as a tax barrister and Partner at Meridian Partners specialising in overseas student-loan matters.</p><p>Dave acknowledged that student loans are taxpayer-funded obligations that must ultimately be addressed. His concern was about how a repayment policy works in practice. Simply increasing penalties may drive borrowers who have already disengaged further away from Inland Revenue, rather than encouraging renewed contact, repayment and compliance. The discussion placed that concern within the wider public debate about the proposed reforms.</p><p>This was independent national media coverage of Dave’s student-loan policy analysis. It was not an advertisement, a prediction about an individual borrower’s matter or an announcement that any particular proposal had become law. Borrowers should distinguish the policy discussion in the broadcast from the rules applying to their own circumstances and from any current IRD decision.</p><p>The embedded player is provided by Three News through Brightcove; the footage is not hosted by DaveTaxNZ. The relevant segment begins at approximately 0:43 and concludes at approximately 4:09. This written account is a summary, not a verbatim transcript. Three News remains the publisher and its inclusion does not imply endorsement of DaveTaxNZ or Meridian Partners. Formal legal services are provided through Meridian Partners, following the appropriate checks and engagement process.</p><h2>Practical points</h2><ul><li>Read the report in its original 30 August 2026 policy context.</li><li>Distinguish proposed reforms from rules applying to an individual matter.</li><li>Engagement with IRD and borrower compliance are central themes.</li><li>Media commentary does not predict an individual outcome.</li></ul><h2>Related information</h2><ul><li><a href=\"/student-loan-negotiations/\">Overseas student-loan advice</a></li><li><a href=\"/articles-media/section-145a-overseas-student-loan-debt/\">Section 145A and overseas student-loan debt</a></li><li><a href=\"/articles-media/can-ird-arrest-me-at-the-border-over-my-student-loan/\">Student-loan border enforcement</a></li><li><a href=\"/#about\">About Dave Ananth</a></li><li><a href=\"https://mplaw.nz/contact/\">Contact Meridian Partners</a></li><li><a href=\"/student-loan-airport-arrest-warrants/\">Student-loan arrest warrants and airport enforcement</a></li></ul><p><a class=\"button\" data-event=\"enquiry_click\" href=\"https://mplaw.nz/contact/?practice=student-loan-debt-ird-negotiation\">Discuss an overseas student-loan matter</a></p><p>Please keep your initial enquiry brief. Do not send detailed confidential information before conflict and engagement checks.</p><p>This material is general information only and is not legal or financial advice. Outcomes depend on the facts and the law applying to each matter. Past outcomes do not guarantee future results. Inland Revenue and the courts retain responsibility for their decisions.</p><p>DaveTaxNZ is Dave Ananth’s professional information and media platform. Formal legal services are provided through Meridian Partners.</p>",
    "mediaV8": true,
    "image": "/assets/articles/three-news-student-loan-reform-2026-08-30-v9.png",
    "imageAlt": "Three News broadcast image showing a reporter and studio presenter during coverage of student-loan proposals.",
    "imageWidth": 1546,
    "imageHeight": 887,
  },
  { slug: "rnz-half-a-million-people-owe-tax", subject: "IRD Tax Debt", type: "Media Coverage", publication: "RNZ", relationship: "Coverage about tax debt and Inland Revenue", date: "11 August 2026", isoDate: "2026-08-11", title: "Over half a million people owe tax. How did this happen?", summary: "RNZ examines how tax debt accumulated and what Inland Revenue’s debt book means for taxpayers.", detailDescription: "RNZ examines the scale of New Zealand’s overdue-tax problem, why debt has accumulated across hundreds of thousands of taxpayers and how Inland Revenue is responding. The original RNZ report provides the full context for taxpayers facing arrears.", url: "https://www.rnz.co.nz/news/business/957513/over-half-a-million-people-owe-tax-how-did-this-happen" },
  { slug: "rnz-overdue-tax", subject: "IRD Tax Debt", type: "Media Interviews", publication: "RNZ", relationship: "Quotes Dave Ananth", date: "1 July 2026", isoDate: "2026-07-01", title: "What should you do about overdue tax?", summary: "RNZ reports on Inland Revenue enforcement and practical steps for taxpayers with overdue tax.", detailDescription: "RNZ outlines practical considerations for people with overdue tax, including engaging with Inland Revenue early and understanding possible repayment options. The original report contains the complete guidance and Dave Ananth’s comments.", url: "https://www.rnz.co.nz/news/personal-finance/650497/what-should-you-do-about-overdue-tax" },
  {
    slug: "rnz-little-known-discounts-overdue-student-loans",
    subject: "Student Loans",
    type: "Media Coverage",
    publication: "RNZ Business",
    author: "Nine to Noon",
    relationship: "RNZ written coverage featuring Dave Ananth; Dave is not the author",
    date: "28 October 2026",
    isoDate: "2026-10-28",
    title: "The little known discounts you can get on overdue student loans",
    summary: "RNZ reports on new interest-relief powers for overseas borrowers with overdue student loans and features Dave Ananth’s comments on the remission process.",
    detailDescription: "The RNZ Business report describes expanded interest-relief powers for overseas student-loan borrowers and includes Dave Ananth’s comments on remission and settlement requirements.",
    sourceUrl: "https://www.rnz.co.nz/news/business/2201439/the-little-known-discounts-you-can-get-on-overdue-student-loans",

  },
  {
    slug: "rnz-nine-to-noon-big-discounts-overdue-student-loans",
    subject: "Student Loans",
    type: "Media Interviews",
    publication: "RNZ · Nine to Noon",
    author: "RNZ",
    relationship: "Nine to Noon radio interview with Dave Ananth",
    date: "28 October 2026",
    isoDate: "2026-10-28",
    title: "Big discounts possible for overdue student loan borrowers",
    summary: "Dave Ananth speaks to RNZ Nine to Noon about overdue New Zealand student loans and overseas-based borrowers, including the April law change giving the Inland Revenue Commissioner power to provide interest relief and existing powers to reduce penalties.",
    detailDescription: "Dave Ananth speaks to RNZ Nine to Noon about overdue New Zealand student loans and overseas-based borrowers, including the April law change giving the Inland Revenue Commissioner power to provide interest relief and existing powers to reduce penalties.",
    sourceUrl: "https://www.rnz.co.nz/national/programmes/ninetonoon/audio/2019057608/big-discounts-possible-for-overdue-student-loan-borrowers",

  },
  { slug: "interest-overseas-student-loans", subject: "Student Loans", type: "Media Coverage", publication: "Interest.co.nz", relationship: "Quotes Dave Ananth", date: "2026", isoDate: "2026", title: "Overseas student loan debt is keeping skilled Kiwis from returning home", summary: "Interest.co.nz reports on growing overseas student-loan balances and their effect on New Zealanders abroad.", detailDescription: "Interest.co.nz reports on the effect of growing overseas student-loan balances on skilled New Zealanders living abroad, including concerns about repayment obligations and returning home. The original article contains the full report and Dave Ananth’s comments.", url: "https://www.interest.co.nz/business/138466/dave-ananth-says-overseas-student-loan-problem-not-just-about-losing-money-its-also" },
];

function applySeptemberV8Amendments(article) {
  let contentHtml = article.contentHtml;

  if (article.slug === "can-ird-arrest-me-at-the-border-over-my-student-loan") {
    contentHtml = contentHtml?.replace(
      "<li><strong>Website: davetaxnz.nz/book-a-consultation</strong></li>",
      '<li><strong>Website: <a href="/book-a-consultation/">davetaxnz.nz/book-a-consultation</a></strong></li>',
    );
  }

  if (["three-news-student-loan-reform-dave-ananth", "student-loan-airport-arrest-warrants"].includes(article.slug)) {
    contentHtml = contentHtml?.replace(
      '<a href="https://mplaw.nz/contact/">Contact Meridian Partners</a>',
      '<a href="/#contact">Contact Dave</a>',
    );
  }

  if (article.slug === "three-news-student-loan-reform-dave-ananth") {
    contentHtml = contentHtml?.replace(
      "The embedded player is provided by Three News through Brightcove; the footage is not hosted by DaveTaxNZ.",
      "The original Three News source is linked below; the footage is not hosted by DaveTaxNZ.",
    );
  }

  return contentHtml === article.contentHtml ? article : { ...article, contentHtml };
}

const assembledArticles = [...wordpressArticles, ...externalArticles, ...homeVoiceArticles, ...clientMedia]
  .map(applySeptemberV8Amendments)
  .map(applyProfileAuditCorrections)
  .sort((a, b) => b.isoDate.localeCompare(a.isoDate));

for (const article of assembledArticles) {
  if (article.language && article.language !== "English" && (!article.pdf || !article.image)) {
    throw new Error(`Non-English article ${article.slug} requires both its publication image and PDF.`);
  }
}

export const articles = assembledArticles;

// Client direction, 29 October 2026: current coverage first in every listing.
export const archiveArticles = [...assembledArticles];

export const subjects = ["Student Loans", "IRD Tax Debt", "Tax Policy", "Crypto Tax", "Other Commentary"];
export const mediaTypes = ["Articles by Dave", "Media Interviews", "Media Coverage", "Community Columns", "Podcasts"];
