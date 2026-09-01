import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, EnvelopeSimple, FileText, GlobeHemisphereWest, List, Phone, Quotes, ShieldCheck, Student, WhatsappLogo, X } from "@phosphor-icons/react";
import { articles, mediaTypes, subjects } from "./articles";
import { testimonials } from "./testimonials";

const phoneDisplay = "+64 21 021 68888";
const phoneHref = "tel:+642102168888";
const whatsappHref = "https://wa.me/642102168888";
const email = "dave@davetaxnz.nz";
const base = import.meta.env.BASE_URL;
const asset = (name) => `${base}assets/${name}`;
const sitePath = (path = "") => `${base}${path.replace(/^\//, "")}`;

function ActionLink({ href, children, secondary = false, external = false, event, download = false }) {
  return <a className={secondary ? "button button--secondary" : "button"} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} data-event={event} download={download || undefined}>{children}</a>;
}

function Header({ menuOpen, setMenuOpen }) {
  const menuButton = useRef(null);
  const nav = useRef(null);
  const close = () => setMenuOpen(false);
  const home = sitePath();
  useEffect(() => {
    if (!menuOpen) return undefined;
    const first = nav.current?.querySelector("a");
    first?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const items = [menuButton.current, ...nav.current.querySelectorAll("a")].filter(Boolean);
      const firstItem = items[0]; const lastItem = items.at(-1);
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen, setMenuOpen]);
  return <header className="site-header">
    <a className="brand" href={home} aria-label="Dave Ananth home" onClick={close}><img src={asset("dave-ananth-logo.webp")} alt="Dave Ananth, Tax Barrister" width="150" height="130" /></a>
    <button ref={menuButton} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={26} /> : <List size={28} />}</button>
    <nav ref={nav} id="site-nav" className={menuOpen ? "nav nav--open" : "nav"} aria-label="Primary navigation">
      <a href={`${home}#about`} onClick={close}>About Dave</a><a href={`${home}#student-loans`} onClick={close}>Student Loans</a><a href={`${home}#tax-debt`} onClick={close}>IRD Tax Debt</a><a href={sitePath("testimonials/")} onClick={close}>Testimonials</a><a href={sitePath("articles-media/")} onClick={close}>Articles &amp; media</a><a href={`${home}#contact`} onClick={close}>Contact</a>
    </nav>
    <ActionLink href={`${home}#contact`} event="consultation_click">Discuss your matter</ActionLink>
  </header>;
}

function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero__copy"><p className="eyebrow">Dave Ananth · Partner at Meridian Partners · Tax Barrister</p><h1 id="hero-title">Student Loan Lawyer NZ and IRD Negotiator</h1><div className="accent-rule" aria-hidden="true" /><p className="hero__lead">Practical legal advice for overseas New Zealanders dealing with long-standing student-loan debt, and for individuals and businesses facing IRD tax debt, disputes or enforcement.</p>
      <a className="alert-link" href="#student-loans"><ShieldCheck size={35} weight="light" /><span>Living overseas with New Zealand student-loan debt? Review the practical options.</span><ArrowRight size={20} /></a>
      <div className="button-row"><ActionLink href="#contact" event="consultation_click">Discuss your matter with Dave</ActionLink><ActionLink href={phoneHref} secondary event="call_click"><Phone size={21} weight="fill" /> Call Dave</ActionLink></div>
    </div>
    <div className="hero__portrait"><img src={asset("dave-ananth-hero.webp")} alt="Dave Ananth, student-loan lawyer and IRD negotiator" width="1280" height="1198" /><div className="portrait-caption"><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span><small>Tax Barrister</small></div></div>
  </section>;
}

function Proof() {
  return <section className="proof section-shell" aria-label="Professional profile and media"><div className="quote-mark"><Quotes size={45} weight="fill" aria-hidden="true" /></div><p className="proof__statement">Specialist advice for overseas New Zealand student-loan matters and IRD tax-debt negotiations.</p>
    <div className="proof__identity"><img src={asset("dave-ananth-profile.webp")} alt="Dave Ananth" width="1280" height="1280" /><p><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span></p></div>
    <div className="proof__media"><img src={asset("media-lockup.png")} alt="As seen in Newstalk ZB, Stuff, NZ Lawyer and The Post" width="402" height="85" /></div>
  </section>;
}

const principalAreas = [
  "Overseas-based student-loan borrowers and long-standing arrears",
  "Student-loan repayment, remission and hardship applications",
  "Student-loan border arrests and urgent pre-travel advice",
  "IRD tax-debt negotiations for individuals and businesses",
  "Income tax, GST and PAYE arrears, penalties and interest",
  "Negotiated tax debt repayment, settlement and financial-relief proposals",
  "Statutory demands, deduction notices, liquidation and bankruptcy risk",
  "New Zealand tax debt pursued against people living overseas",
  "Bright-line property tax advice, exclusions and IRD disputes",
  "Tax policy",
];
const publicRoles = [
  { text: "Partner, Meridian Partners", href: "https://mplaw.nz/about-meridian-partners/dave-ananth/" },
  { text: "Former Inland Revenue prosecutor" },
  { text: "Honorary Consul of Timor-Leste for the North Island, New Zealand", href: "https://www.consulatetimorleste.co.nz/" },
  { text: "Honorary Advisor for the ASEAN Region, Auckland Business Chamber", href: "https://aucklandchamber.co.nz/internation-advisors/" },
  { text: "Founder and President, New Zealand Malaysian Business Association", href: "https://nzmba.org.nz/" },
  { text: "Layperson Member, Health Practitioners Disciplinary Tribunal" },
  { text: "Expert Panel Member – Ethnic Advisory Panel, Indian Newslink" },
  { text: "Trustee - Atmabhav", href: "https://atmabhav.org.nz/" },
  { text: "Life Member, Judicial Officers Association, Malaysia" },
  { text: "Former Magistrate and Judicial Officer, Malaysia" },
  { text: "Former Director, EY Malaysia" },
];

function AboutDave() {
  return <section id="about" className="about section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">About Dave</p><h2>Dave Ananth — Student Loan Lawyer and IRD Negotiator</h2><p>DaveTaxNZ is Dave’s personal professional information, publication and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p></div>
    <div className="about__grid"><div className="about__copy"><p>Dave Ananth is an Auckland-based lawyer whose areas of specialisation focus on overseas New Zealand student-loan debt, along with complex tax negotiations and Inland Revenue Department (IRD) disputes for both individuals and businesses.</p><p>Many of his student-loan clients left New Zealand years or decades ago. During that period, their balances increased through compounding overseas interest, missed obligations, and late-payment penalties. Some are frightened to contact Inland Revenue, worried about travelling to New Zealand, or uncertain whether any practical resolution remains available.</p><p>Drawing on his experience as a former IRD prosecutor and adjudicator, Dave reviews the history of each matter, identifies realistic options and, where formally engaged, communicates and negotiates with Inland Revenue on the client’s behalf. This may include preparing hardship or remission applications where proper grounds exist, and presenting repayment, settlement or financial-relief proposals. Final determinations, processing timeframes, enforcement decisions and any border-related outcome remain at the discretion of Inland Revenue and the courts.</p><p>Dave has more than 35 years of legal experience across New Zealand and Malaysia, including past tenure as a Magistrate and Judicial Officer. He is presently a Partner at <a href="https://mplaw.nz/about-meridian-partners/dave-ananth/" target="_blank" rel="noopener noreferrer">Meridian Partners</a> in Auckland. Beyond his core tax practice, Dave also serves as the <a href="https://www.consulatetimorleste.co.nz/" target="_blank" rel="noopener noreferrer">Honorary Consul of Timor-Leste</a> in Auckland. In this diplomatic role, he facilitates cross-border labour mobility under New Zealand’s Recognised Seasonal Employer (RSE) framework, supports international trade and agricultural-sector collaboration, and advises stakeholders and investors on digital and commercial opportunities across borders.</p><a className="text-link" href="#student-loans">Explore Dave’s areas of work <ArrowRight size={18} /></a></div>
      <div className="about__list"><h3>Dave’s areas of expertise</h3><ul>{principalAreas.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="about__list about__list--roles"><h3>Professional and public roles</h3><ul>{publicRoles.map(({ text, href }) => <li key={text}>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{text}</a> : text}</li>)}</ul></div>
    </div>
  </section>;
}

const expertise = [
  { icon: Student, title: "Review the loan history", text: "Reviewing long-standing balances, repayment histories, accumulated interest and penalties, including illness, hardship and family circumstances." },
  { icon: FileText, title: "Engage with Inland Revenue", text: "Where formally engaged, Dave may communicate with IRD, prepare remission applications where proper grounds exist, and present repayment or settlement proposals." },
  { icon: GlobeHemisphereWest, title: "Assess return and enforcement risks", text: "Assessing possible enforcement or border risks and advising overseas borrowers who want to return to New Zealand. Final determinations, processing timeframes, and decisions are at the discretion of Inland Revenue." },
];

function StudentLoans() {
  return <section id="student-loans" className="expertise section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">Student Loan Debt &amp; Penalties</p><h2>How Dave helps overseas student-loan borrowers</h2><p>Dave advises on engaging with Inland Revenue, seeking penalty relief where appropriate, presenting repayment or settlement proposals, and assessing possible enforcement or border risks.</p></div>
    <div className="expertise-grid">{expertise.map(({ icon: Icon, title, text }, index) => <div className="expertise-item" key={title}><span className="expertise-item__number">0{index + 1}</span><Icon size={34} weight="light" /><h3>{title}</h3><p>{text}</p></div>)}</div><div className="practice-more"><a className="text-link" href={sitePath("student-loan-negotiations/")}>Read more about student-loan negotiations <ArrowRight size={18} /></a></div>
  </section>;
}

const taxDebtAreas = [
  { icon: FileText, title: "Assess the tax-debt position", text: "Reviewing income tax, GST and PAYE arrears, penalties and interest, including New Zealand tax debt pursued against people living overseas." },
  { icon: GlobeHemisphereWest, title: "Negotiate with Inland Revenue", text: "Where formally engaged, Dave may present repayment, settlement or financial-relief proposals. Inland Revenue determines whether any proposal is accepted." },
  { icon: ShieldCheck, title: "Respond to disputes and enforcement", text: "Advice on statutory demands, deduction notices, liquidation and bankruptcy risk, and bright-line property tax disputes. Final determinations, processing timeframes, and decisions are at the discretion of Inland Revenue." },
];

function TaxDebt() {
  return <section id="tax-debt" className="expertise tax-debt section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">Tax Disputes &amp; IRD Negotiation</p><h2>IRD tax-debt advice and negotiation</h2><p>Dave advises individuals and businesses on tax debt, financial-relief proposals, Inland Revenue disputes and enforcement. He works with the client’s accountant where returns, financial reconstruction or supporting schedules are required.</p></div>
    <div className="expertise-grid">{taxDebtAreas.map(({ icon: Icon, title, text }, index) => <div className="expertise-item" key={title}><span className="expertise-item__number">0{index + 1}</span><Icon size={34} weight="light" /><h3>{title}</h3><p>{text}</p></div>)}</div><div className="practice-more"><a className="text-link" href={sitePath("ird-disputes-tax-penalties-negotiation/")}>Read more about IRD tax-debt negotiation <ArrowRight size={18} /></a></div>
  </section>;
}

function StoriesPreview() {
  const previews = [
    ["Dave literally changed our financial trajectory. He is deeply knowledgeable about the IRD and how student loans work, especially for people living overseas. He negotiated a settlement that chopped my debt by two thirds and arranged a very reasonable lump sum payment… Thanks to him, I’ll be completely debt free.", "Martyn Svendsen", "August 2026"],
    ["The process of sorting out my student loan debt, which was daunting and overwhelming for me, was managed with reassurance, professionalism, trust and kindness…. Handing over the reins to Dave unburdened me from anxiety and shame. He is a master negotiator with the IRD—reducing my debt total by 30 percent. With Dave’s help I am now debt-free, feel lighter and happier than I have in years, and engaging with his team has been nothing less than life-changing.", "Sarah Williams", "October 2025"],
    ["I contacted Dave Ananth and immediately, my life changed. Dave works fast. In less than five business days almost 20 years of anxiety, stress and shame was gone. His expertise and professionalism saw him deftly navigate the IRD system and win a viable resolution seeing my loan consolidated and completed. Gone FOREVER.", "Felicity McKeen", "August 2025"],
  ];
  return <section id="stories" className="stories"><div className="section-shell"><div className="stories__heading"><p className="eyebrow eyebrow--gold">Testimonials</p><h2>Student Loan Client Experiences</h2></div><div className="testimonial-grid">{previews.map(([quote, name, date]) => <figure key={name}><blockquote>“{quote}”</blockquote><figcaption><strong>{name}</strong><span>Student loan client · {date}</span></figcaption></figure>)}</div><p className="outcomes-note outcomes-note--light">These are exact excerpts from individual client accounts. Past outcomes do not guarantee future results.</p><div className="story-links"><a className="text-link text-link--light" href={sitePath("testimonials/")}>Read more testimonials <ArrowRight size={18} /></a><a className="text-link text-link--light" href={sitePath("#contact")} data-event="consultation_click">Request an initial call <ArrowRight size={18} /></a></div></div></section>;
}

function ArticleCard({ article, internal = true }) {
  const externalUrl = article.sourceUrl ?? (!article.contentHtml ? article.url : undefined);
  return <article className="article-card"><div className="article-meta"><span>{article.publication}</span><time dateTime={article.isoDate}>{article.date}</time></div><h3>{article.title}</h3><p>{article.summary}</p><span className="article-type">{article.subject} · {article.type}</span><div className="article-actions">{internal && <a className="text-link" href={sitePath(`articles-media/${article.slug}/`)}>View details <ArrowRight size={18} /></a>}{externalUrl && <a className="text-link text-link--muted" href={externalUrl} target="_blank" rel="noopener noreferrer">Original source</a>}</div></article>;
}

function InsightsPreview() {
  const latest = articles.slice(0, 6);
  return <section id="insights" className="insights insights--preview section-shell section-pad"><div className="insights__intro"><p className="eyebrow eyebrow--red">Latest thinking</p><h2>Articles &amp; Media</h2><p>The latest published work and independent coverage. Relationship labels are based on the linked source.</p><a className="text-link" href={sitePath("articles-media/")}>Search the complete archive <ArrowRight size={18} /></a></div><div className="article-grid">{latest.map((article) => <ArticleCard article={article} key={article.slug} />)}</div></section>;
}

function Contact() {
  return <section id="contact" className="contact"><div className="section-shell contact__grid"><div><p className="eyebrow eyebrow--gold">Contact Dave</p><h2>Discuss your matter with Dave</h2><p>Request a free 15-minute initial call by phone, WhatsApp or email. Contact does not create a lawyer–client relationship or confirm acceptance.</p></div>
    <div className="contact__links"><a href={phoneHref} data-event="call_click"><Phone size={27} weight="fill" /><span><small>Call Dave directly</small>{phoneDisplay}</span></a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click"><WhatsappLogo size={27} weight="fill" /><span><small>Message Dave</small>WhatsApp</span></a><a href={`mailto:${email}`} data-event="email_click"><EnvelopeSimple size={27} weight="fill" /><span><small>Email Dave</small>{email}</span></a></div>
    <div className="contact__action"><Check size={28} weight="bold" /><p>Please do not send extensive confidential, medical, financial or identity information before conflicts are checked and a formal Meridian Partners engagement is confirmed.</p><ActionLink href={`mailto:${email}?subject=Initial%20consultation%20request`} event="consultation_click">Email Dave to request a call</ActionLink></div>
  </div></section>;
}

function Footer() {
  return <footer className="footer section-shell"><img src={asset("dave-ananth-logo.webp")} alt="Dave Ananth Tax Barrister" width="120" height="105" /><p>Dave Ananth is a Partner at Meridian Partners. DaveTaxNZ is Dave’s personal professional information, publication and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p><div><a href={phoneHref} data-event="call_click">Mobile: {phoneDisplay}</a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click">WhatsApp Dave</a><a href={`mailto:${email}`} data-event="email_click">{email}</a><a href="https://mplaw.nz/about-meridian-partners/dave-ananth/" target="_blank" rel="noopener noreferrer">Meridian Partners</a><a href={sitePath("terms/")}>Terms</a><a href={sitePath("privacy/")}>Privacy</a><a href={sitePath("legal-disclaimer/")}>Legal &amp; engagement disclaimer</a></div><small>© 2026 Dave Ananth. Information on this site is general information, not advice. No outcome or timeframe is guaranteed.</small><a className="footer-powered-by" href="https://infiniteminds.app/" target="_blank" rel="noopener noreferrer" aria-label="Powered by Infinite Minds AI"><span>Powered by</span><img src={asset("infinite-minds-ai-logo-white.png")} alt="Infinite Minds AI" width="1536" height="1024" loading="lazy" decoding="async" /></a></footer>;
}

function PageIntro({ eyebrow, title, children }) {
  return <section className="page-intro section-shell"><p className="eyebrow eyebrow--gold">{eyebrow}</p><h1>{title}</h1>{children && <p>{children}</p>}</section>;
}

function ArchivePage() {
  const [subject, setSubject] = useState("All subjects");
  const [type, setType] = useState("All types");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => { const search = query.trim().toLowerCase(); return articles.filter((article) => (subject === "All subjects" || article.subject === subject) && (type === "All types" || article.type === type) && (!search || [article.title, article.summary, article.publication, article.relationship, article.subject, article.type].some((value) => value.toLowerCase().includes(search)))); }, [subject, type, query]);
  return <><PageIntro eyebrow="Publication and media platform" title="Articles & Media Archive">Search by subject and publication type. External source links open the original publisher in a new tab.</PageIntro><main id="main" className="archive section-shell section-pad"><div className="archive-tools"><label>Search archive<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, publications and topics" /></label><label>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}><option>All subjects</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option>All types</option>{mediaTypes.map((item) => <option key={item}>{item}</option>)}</select></label></div><p className="archive-count" aria-live="polite">{visible.length} {visible.length === 1 ? "item" : "items"}</p><div className="article-grid">{visible.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>{!visible.length && <p>No items match those filters.</p>}</main></>;
}

function ArticlePage({ article }) {
  const showFeaturedImage = article.image && !article.suppressFeaturedImage && !article.contentHtml?.includes(`src=\"${article.image}\"`);
  const sourceUrl = article.sourceUrl ?? (!article.contentHtml ? article.url : undefined);
  return <main id="main"><PageIntro eyebrow={`${article.subject} · ${article.type}`} title={article.title}>{article.publication} · {article.date}</PageIntro><article className="detail-page section-shell section-pad"><dl><div><dt>Publication</dt><dd>{article.publication}</dd></div><div><dt>Relationship</dt><dd>{article.relationship}</dd></div><div><dt>Published</dt><dd>{article.date}</dd></div></dl>{showFeaturedImage && <img className={`article-featured${article.imagePresentation === "document" ? " article-featured--document" : ""}`} src={article.image} alt={article.imageAlt} width={article.imageWidth} height={article.imageHeight} />}{article.detailDescription && <p>{article.detailDescription}</p>}{article.contentHtml ? <><p className="archive-note">This is general information, not legal, tax or accounting advice.</p><div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /></> : <>{!article.detailDescription && <p>{article.summary}</p>}<p>This record identifies the publication and Dave’s relationship to it from the linked source. It does not add or imply any unverified claim.</p></>}<div className="article-source-actions">{article.pdf && <ActionLink href={asset(article.pdf)} download={article.pdfDownloadName || true}>Download the published PDF</ActionLink>}{sourceUrl && <ActionLink href={sourceUrl} external>View the original source</ActionLink>}</div><a className="text-link" href={sitePath("articles-media/")}>Return to the archive <ArrowRight size={18} /></a></article></main>;
}

const legalPages = {
  "terms": { eyebrow: "Site terms", title: "Terms of Use", sections: [["Purpose", "DaveTaxNZ is Dave Ananth’s personal professional information, publication and media platform. It is not a law firm website. Formal legal services and engagements are provided through Meridian Partners."], ["General information", "Website content is general information only and is not legal, tax or accounting advice. It may not be complete or current for your circumstances."], ["Contact and engagement", "An email, call or message does not create a lawyer–client relationship, confirm acceptance of a matter or reserve Dave’s availability. Representation begins only after conflicts and suitability checks and a formal Meridian Partners engagement."], ["External links", "Links to publishers and third-party services are provided for reference. Their content, availability and privacy practices are controlled by those providers."]] },
  "legal-disclaimer": { eyebrow: "Important information", title: "Legal & Engagement Disclaimer", sections: [["No legal advice", "The information on this site is general. Do not rely on it as legal, tax or accounting advice for a particular matter."], ["No engagement by contact", "Contacting Dave does not create a lawyer–client relationship. Conflicts checks, acceptance and a formal Meridian Partners engagement are required before legal services begin."], ["Confidential information", "Do not send extensive confidential, medical, financial or identity information before an engagement is confirmed."], ["Outcomes and timing", "Every matter depends on its facts, evidence and Inland Revenue’s decisions. Past outcomes do not guarantee future results. No outcome or timeframe can be guaranteed."]] },
};

function LegalPage({ page }) {
  return <main id="main"><PageIntro eyebrow={page.eyebrow} title={page.title} /><div className="legal-page section-shell section-pad">{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div></main>;
}

function PrivacyPage() {
  return <main id="main"><PageIntro eyebrow="Privacy" title="Privacy Statement">How DaveTaxNZ handles information provided through this website and its contact channels.</PageIntro><div className="legal-page section-shell section-pad"><section><h2>Scope</h2><p>This statement applies to DaveTaxNZ website visits and contact initiated through its email, telephone and WhatsApp links. Personal information is handled in accordance with the New Zealand Privacy Act 2020.</p></section><section><h2>Information you choose to provide</h2><p>The website does not contain an enquiry form. Dave may receive your name, contact details and information you choose to provide when you email, call or use WhatsApp. Do not send extensive confidential, medical, financial or identity information before a formal engagement.</p></section><section><h2>How information is used</h2><p>Information may be used to respond, arrange an initial call, complete conflict and suitability checks, and determine whether Meridian Partners may offer a formal engagement. Information connected with an accepted legal matter is then handled under the applicable Meridian Partners engagement and professional obligations.</p></section><section><h2>Website providers</h2><p>The website is hosted by GitHub Pages and uses Cloudflare for DNS. Google Analytics provides aggregate website-use information. Google Fonts supplies the displayed web fonts. WhatsApp and linked publishers are separate services with their own privacy practices, and their systems may process information outside New Zealand.</p></section><section><h2>Analytics</h2><p>Google Analytics runs on davetaxnz.nz to measure visits and interactions. The website event design does not send names, email addresses, phone numbers, message content or other user-entered personal information to Analytics.</p></section><section><h2>Access and correction</h2><p>You may ask to access or correct personal information held about you by emailing <a href={`mailto:${email}`}>{email}</a>.</p></section></div></main>;
}

const practicePages = {
  "student-loan-negotiations": {
    eyebrow: "Overseas student-loan debt",
    title: "Student Loan Negotiations & IRD Help",
    intro: "If you are living overseas, planning to return to New Zealand, or feeling pressure from Inland Revenue over an unpaid student loan, you do not need to assess the position alone.",
    sections: [
      {
        heading: "The issues overseas borrowers may face",
        body: "Long periods overseas can turn an old student-loan balance into a difficult and stressful problem. Depending on the borrower’s history, the account may involve:",
        bullets: ["Overseas interest and late-payment interest", "Missed repayment obligations and long-standing arrears", "Default status or debt-collection contact", "Inland Revenue correspondence or possible enforcement action", "Concern about travelling to or leaving New Zealand", "Uncertainty about records, balances and available options"],
      },
      {
        heading: "How Dave may assist",
        body: "Dave’s work begins with the facts of the individual matter. Once formally engaged through Meridian Partners, assistance may include:",
        bullets: ["Reviewing the loan history, repayment record, interest and penalties", "Communicating with Inland Revenue on the borrower’s behalf", "Preparing remission or hardship applications where proper grounds exist", "Presenting repayment or settlement proposals supported by relevant information", "Assessing possible enforcement or border-related risks before planned travel", "Explaining Inland Revenue correspondence and the practical next steps"],
      },
      {
        heading: "What early engagement can clarify",
        body: "A review can establish what Inland Revenue records, what is overdue, whether formal recovery steps have begun, what information is missing, and which applications or proposals may be available. Acting early does not guarantee an outcome, but it can avoid decisions being made without the borrower’s evidence or explanation.",
        bullets: ["The current balance and repayment history", "The status of interest, arrears and enforcement correspondence", "Information needed for a hardship or remission application", "Whether a repayment or settlement proposal is realistic", "Issues to address before any planned New Zealand travel"],
      },
      {
        heading: "Experience and approach",
        body: "Dave is a Tax Barrister, a Partner at Meridian Partners, and a former Inland Revenue prosecutor and adjudicator. He has more than 35 years of legal experience across New Zealand and Malaysia. His approach is confidential, practical and non-judgmental, with formal advice based on the evidence and circumstances of each client.",
      },
      {
        heading: "Preparing for an initial discussion",
        body: "If available, it is useful to have your latest Inland Revenue statement, recent correspondence, a brief repayment history, your current location and any intended New Zealand travel dates. Do not email extensive financial, medical or identity documents until conflicts checks and a formal engagement are confirmed.",
      },
    ],
    faqs: [
      ["Can Dave assist while I am overseas?", "Many matters can be reviewed and progressed remotely. Whether Dave can act depends on conflicts, suitability checks and a formal Meridian Partners engagement."],
      ["Can penalties or interest be reduced?", "Inland Revenue may consider remission or hardship relief where the statutory and evidential grounds are met. Inland Revenue decides whether any application or proposal is accepted."],
      ["What if I am worried about travelling to New Zealand?", "Seek advice before booking or commencing travel. Dave may assess the available information and communicate with Inland Revenue where formally engaged, but no border or enforcement outcome can be guaranteed."],
      ["Is it too late if I have ignored correspondence for years?", "Delay can narrow the available options, but the position can still be reviewed. Early, accurate engagement is generally preferable to further delay."],
      ["Will Inland Revenue consider my personal circumstances?", "Relevant illness, hardship, family obligations, employment changes and repayment history may form part of an application or proposal when supported by appropriate evidence. Inland Revenue decides what weight to give that information."],
      ["Is the initial contact confidential?", "Initial contact is handled discreetly, but you should not send extensive confidential or identity material until conflicts checks and a formal engagement are confirmed."],
    ],
  },
  "ird-disputes-tax-penalties-negotiation": {
    eyebrow: "Selected IRD tax-debt matters",
    title: "Tax Debt, IRD Disputes & Negotiations",
    intro: "When Inland Revenue begins issuing demands, penalties or enforcement correspondence, the financial and legal position can escalate quickly. Early review can help identify the facts, deadlines and realistic options.",
    sections: [
      {
        heading: "When Inland Revenue pressure escalates",
        body: "Selected tax-debt matters may involve:",
        bullets: ["Income-tax, GST or PAYE arrears", "Accumulated penalties and use-of-money interest", "Defaulted instalment arrangements", "Deduction notices or statutory demands", "Liquidation or bankruptcy risk", "New Zealand tax debt pursued against a person living overseas", "Bright-line property-tax disputes connected with an existing Inland Revenue matter"],
      },
      {
        heading: "How Dave may assist",
        body: "Where formally engaged through Meridian Partners, Dave may:",
        bullets: ["Review the tax-debt and enforcement position", "Communicate and negotiate with Inland Revenue", "Prepare remission applications where proper grounds exist", "Present repayment, settlement or financial-relief proposals", "Respond to statutory demands, deduction notices and recovery action", "Work with the client’s accountant on financial evidence and supporting schedules"],
      },
      {
        heading: "Penalties, interest and payment proposals",
        body: "Penalties and interest can continue to increase while an account remains unresolved. Inland Revenue may consider remission, instalment or settlement proposals in appropriate circumstances, but each request must be supported by the applicable facts and evidence.",
        bullets: ["A clear account of how the arrears arose", "Complete and current financial information", "Realistic capacity-to-pay evidence", "A credible plan for future compliance", "Supporting material for any hardship or remission grounds"],
      },
      {
        heading: "Working with your accountant or tax agent",
        body: "Dave does not provide accounting, tax-return preparation or general technical tax services through DaveTaxNZ. Where returns, financial reconstruction or technical schedules are required, he works with the client’s accountant or tax agent so the legal and financial material is coordinated.",
      },
      {
        heading: "Experience and approach",
        body: "Dave is a Tax Barrister, a Partner at Meridian Partners, and a former Inland Revenue prosecutor and adjudicator. His work in this area focuses on selected debt, negotiation and enforcement matters rather than general tax advice or routine compliance work.",
      },
    ],
    faqs: [
      ["Can Inland Revenue penalties be remitted?", "Inland Revenue may consider remission where the applicable grounds and supporting evidence are established. Each decision remains at Inland Revenue’s discretion."],
      ["Can a repayment proposal stop enforcement?", "Inland Revenue decides whether a proposal is accepted and whether enforcement is paused or continued. A proposal should therefore be realistic, complete and supported by the required information."],
      ["What if returns or financial records are incomplete?", "An accountant or tax agent may need to complete returns, reconstruct records or prepare schedules before a proposal can be properly assessed."],
      ["Does contacting Dave create a lawyer–client relationship?", "No. Representation begins only after conflicts and suitability checks, acceptance of the matter and a formal Meridian Partners engagement."],
      ["What should I do with a statutory demand or urgent notice?", "Record the date it was received and obtain advice promptly because legal response periods may be short. Do not assume that contacting Inland Revenue informally pauses a deadline."],
      ["Can Dave fix tax returns or provide accounting advice?", "No. Dave may coordinate with the client’s accountant or tax agent, but DaveTaxNZ does not provide accounting, return-preparation or general technical tax services."],
    ],
  },
};

function PracticePage({ page }) {
  return <main id="main"><PageIntro eyebrow={page.eyebrow} title={page.title}>{page.intro}</PageIntro><article className="practice-page section-shell section-pad"><p className="practice-page__notice">This page is general information. Final determinations, processing timeframes and decisions are at the discretion of Inland Revenue and, where applicable, the courts.</p><div className="practice-page__sections">{page.sections.map(({ heading, body, bullets }) => <section key={heading}><h2>{heading}</h2><p>{body}</p>{bullets && <ul>{bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div><section className="practice-page__faq"><p className="eyebrow eyebrow--red">Practical questions</p><h2>Frequently asked questions</h2><div>{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section><div className="practice-page__action"><div><p className="eyebrow eyebrow--gold">Discuss your circumstances</p><h2>Start with an initial call</h2><p>Contact does not create a lawyer–client relationship or confirm acceptance of a matter.</p></div><div className="button-row"><ActionLink href={sitePath("#contact")} event="consultation_click">Discuss your matter with Dave</ActionLink><ActionLink href={phoneHref} secondary event="call_click"><Phone size={21} weight="fill" /> Call Dave</ActionLink></div></div></article></main>;
}

function TestimonialsPage() {
  const [expanded, setExpanded] = useState(() => new Set());
  const toggle = (index) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  return <main id="main"><PageIntro eyebrow="Client experiences" title="Testimonials">These testimonials describe individual client experiences. Every student-loan matter is different, and previous outcomes do not guarantee that the same result will be available in another case.</PageIntro><div className="testimonials-page section-shell section-pad"><p className="testimonial-context">Some reviews were originally published while Dave was at Stace Hammond. Dave is now a Partner at Meridian Partners.</p><div className="testimonial-archive">{testimonials.map(({ name, date, quote }, index) => {
    const isLong = quote.length > 360;
    const isExpanded = expanded.has(index);
    const copyId = `testimonial-${index}`;
    return <article className="testimonial-card" key={`${name}-${date}-${index}`}><blockquote id={copyId} className={isLong && !isExpanded ? "review-copy review-copy--collapsed" : "review-copy"}>“{quote}”</blockquote><div className="testimonial-card__footer"><p><strong>{name}</strong>{date && <span>{date}</span>}</p>{isLong && <button className="review-toggle" type="button" aria-expanded={isExpanded} aria-controls={copyId} onClick={() => toggle(index)}>{isExpanded ? "Less" : "More"}</button>}</div></article>;
  })}</div><div className="testimonial-safeguards"><p>Only exact, source-approved testimonial wording is published.</p><p>Testimonials describe individual experiences. Past outcomes do not guarantee future results. No outcome or timeframe can be guaranteed.</p></div></div></main>;
}

function NotFound() {
  return <main id="main"><PageIntro eyebrow="404" title="Page not found">The page may have moved or the address may be incorrect.</PageIntro><div className="detail-page section-shell section-pad"><a className="text-link" href={sitePath()}>Return to the homepage <ArrowRight size={18} /></a></div></main>;
}

function HomePage() {
  return <><Proof /><AboutDave /><StudentLoans /><TaxDebt /><StoriesPreview /><InsightsPreview /><Contact /></>;
}

function normalisePath(path) {
  const cleanBase = base.replace(/^\//, "").replace(/\/$/, "");
  let clean = (path || "/").split("?")[0].split("#")[0].replace(/^\//, "").replace(/\/$/, "");
  if (cleanBase && clean.startsWith(`${cleanBase}/`)) clean = clean.slice(cleanBase.length + 1);
  else if (clean === cleanBase) clean = "";
  return clean;
}

export function App({ initialPath = "/" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = normalisePath(initialPath);
  const article = path.startsWith("articles-media/") ? articles.find((item) => item.slug === path.split("/")[1]) : undefined;
  let content;
  if (!path) content = <HomePage />;
  else if (path === "articles-media") content = <ArchivePage />;
  else if (article) content = <ArticlePage article={article} />;
  else if (practicePages[path]) content = <PracticePage page={practicePages[path]} />;
  else if (path === "testimonials") content = <TestimonialsPage />;
  else if (path === "privacy") content = <PrivacyPage />;
  else if (legalPages[path]) content = <LegalPage page={legalPages[path]} />;
  else content = <NotFound />;
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" className="dark-shell"><Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{!path && <main id="main"><Hero /></main>}</div>{content}<Footer /></>;
}
