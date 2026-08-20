import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, EnvelopeSimple, FileText, GlobeHemisphereWest, List, Phone, Quotes, ShieldCheck, Student, WhatsappLogo, X } from "@phosphor-icons/react";
import { articles, mediaTypes, subjects } from "./articles";

const phoneDisplay = "+64 21 021 68888";
const phoneHref = "tel:+642102168888";
const whatsappHref = "https://wa.me/642102168888";
const email = "dave@davetaxnz.nz";
const base = import.meta.env.BASE_URL;
const asset = (name) => `${base}assets/${name}`;
const sitePath = (path = "") => `${base}${path.replace(/^\//, "")}`;

function ActionLink({ href, children, secondary = false, external = false, event }) {
  return <a className={secondary ? "button button--secondary" : "button"} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} data-event={event}>{children}</a>;
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
      <a href={`${home}#about`} onClick={close}>About Dave</a><a href={`${home}#expertise`} onClick={close}>Expertise</a><a href={sitePath("testimonials/")} onClick={close}>Client stories</a><a href={sitePath("articles-media/")} onClick={close}>Articles &amp; media</a><a href={`${home}#contact`} onClick={close}>Contact</a>
    </nav>
    <ActionLink href={`${home}#contact`} event="consultation_click">Discuss your student loan</ActionLink>
  </header>;
}

function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero__copy"><p className="eyebrow">Dave Ananth · Partner at Meridian Partners · Former Inland Revenue Prosecutor</p><h1 id="hero-title">Student Loan Lawyer NZ and IRD Negotiator</h1><div className="accent-rule" aria-hidden="true" /><p className="hero__lead">Practical legal advice for overseas New Zealanders dealing with long-standing student-loan debt, penalties, repayment demands and possible IRD enforcement.</p>
      <a className="alert-link" href="#expertise"><ShieldCheck size={35} weight="light" /><span>Living overseas with New Zealand student-loan debt? Review the practical options.</span><ArrowRight size={20} /></a>
      <div className="button-row"><ActionLink href="#contact" event="consultation_click">Discuss your student loan with Dave</ActionLink><ActionLink href={phoneHref} secondary event="call_click"><Phone size={21} weight="fill" /> Call Dave</ActionLink></div>
    </div>
    <div className="hero__portrait"><img src={asset("dave-ananth-hero.webp")} alt="Dave Ananth, student-loan lawyer and IRD negotiator" width="1280" height="1198" /><div className="portrait-caption"><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span><small>Former Inland Revenue Prosecutor</small></div></div>
  </section>;
}

function Proof() {
  return <section className="proof section-shell" aria-label="Professional profile and media"><div className="quote-mark"><Quotes size={45} weight="fill" aria-hidden="true" /></div><p className="proof__statement">Principal specialist practice in overseas New Zealand student-loan matters, supported by selected IRD tax-debt work.</p>
    <div className="proof__identity"><img src={asset("dave-ananth-profile.webp")} alt="Dave Ananth" width="1280" height="1280" /><p><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span></p></div>
    <div className="proof__media"><img src={asset("media-lockup.png")} alt="As seen in Newstalk ZB, Stuff, NZ Lawyer and The Post" width="402" height="85" /></div>
  </section>;
}

const principalAreas = ["Overseas-based student-loan borrowers", "Long-standing student-loan arrears", "Penalties and interest", "Repayment and settlement proposals", "Remission applications", "Hardship and medical circumstances", "IRD communication and negotiation", "Enforcement and border-risk assessment"];
const publicRoles = ["Partner, Meridian Partners", "Former Inland Revenue solicitor and prosecutor", "Former Malaysian Magistrate and Judicial Officer", "Former Director, EY Malaysia", "Honorary Consul of Timor-Leste", "President, New Zealand Malaysian Business Association", "Honorary Advisor, ASEAN Region, Auckland Business Chamber"];

function AboutDave() {
  return <section id="about" className="about section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">About Dave</p><h2>Dave Ananth — Student Loan Lawyer and IRD Negotiator</h2><p>DaveTaxNZ is Dave’s personal professional information, publication and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p></div>
    <div className="about__grid"><div className="about__copy"><p>Dave Ananth is an Auckland-based lawyer whose principal specialist practice is helping overseas New Zealanders address long-standing student-loan debt with Inland Revenue.</p><p>Many clients left New Zealand years or decades ago. During that period, their student-loan balances increased through overseas interest, missed obligations and late-payment penalties. Some are frightened to contact Inland Revenue, worried about travelling to New Zealand, or uncertain whether any practical resolution remains available.</p><p>Dave reviews the history of each matter, identifies realistic options and, where formally engaged, communicates and negotiates with Inland Revenue on the borrower’s behalf.</p><p>Dave is a former Inland Revenue solicitor and prosecutor and has more than 35 years of legal experience in New Zealand and Malaysia. He is presently a Partner at Meridian Partners in Auckland.</p><a className="text-link" href="#expertise">Learn how Dave assesses overseas student-loan matters <ArrowRight size={18} /></a></div>
      <div className="about__list"><h3>Dave’s principal areas of work</h3><ul>{principalAreas.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="about__list about__list--roles"><h3>Professional and public roles</h3><ul>{publicRoles.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div>
  </section>;
}

const expertise = [
  { icon: Student, title: "Review the loan history", text: "Reviewing long-standing balances, repayment histories, accumulated interest and penalties, including illness, hardship and family circumstances." },
  { icon: FileText, title: "Engage with Inland Revenue", text: "Where formally engaged, Dave may communicate with IRD, prepare remission applications where proper grounds exist, and present repayment or settlement proposals." },
  { icon: GlobeHemisphereWest, title: "Assess return and enforcement risks", text: "Assessing possible enforcement or border risks and advising overseas borrowers who want to return to New Zealand. No outcome or timeframe can be guaranteed." },
];

function Expertise() {
  return <section id="expertise" className="expertise section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">Principal specialist practice</p><h2>How Dave helps overseas student-loan borrowers</h2><p>Dave advises on engaging with Inland Revenue, seeking penalty relief where appropriate, presenting repayment or settlement proposals, and assessing possible enforcement or border risks.</p></div>
    <div className="expertise-grid">{expertise.map(({ icon: Icon, title, text }, index) => <div className="expertise-item" key={title}><span className="expertise-item__number">0{index + 1}</span><Icon size={34} weight="light" /><h3>{title}</h3><p>{text}</p></div>)}</div>
    <aside className="tax-debt-note"><div><p className="eyebrow eyebrow--red">Selected matters</p><h3>Selected IRD tax-debt matters</h3></div><p>Dave also acts in selected IRD tax-debt matters involving income tax, GST, PAYE, penalties, repayment proposals and enforcement. He works with the client’s accountant where returns, financial reconstruction or supporting schedules are required. He does not prepare tax returns or conduct tax litigation. <a href="#contact">Contact Dave to discuss whether the matter is within scope</a>.</p></aside>
  </section>;
}

function StoriesPreview() {
  const previews = [["Within just two days, the entire process was turned around.", "Jana R", "June 2025"], ["Managed with reassurance, professionalism, trust and kindness.", "Sarah Williams", "October 2025"], ["His generosity, empathy and kindness.", "Felicity McKeen", "April 2025"]];
  return <section id="stories" className="stories"><div className="section-shell"><div className="stories__heading"><p className="eyebrow eyebrow--gold">Testimonials</p><h2>Student Loan Client Experiences</h2></div><div className="testimonial-grid">{previews.map(([quote, name, date]) => <figure key={name}><blockquote>“{quote}”</blockquote><figcaption><strong>{name}</strong><span>Student loan client · {date}</span></figcaption></figure>)}</div><p className="outcomes-note outcomes-note--light">These are exact excerpts from individual client accounts. Past outcomes do not guarantee future results.</p><div className="story-links"><a className="text-link text-link--light" href={sitePath("testimonials/")}>Read testimonial information <ArrowRight size={18} /></a><a className="text-link text-link--light" href={sitePath("#contact")} data-event="consultation_click">Request an initial call <ArrowRight size={18} /></a></div></div></section>;
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
  return <footer className="footer section-shell"><img src={asset("dave-ananth-logo.webp")} alt="Dave Ananth Tax Barrister" width="120" height="105" /><p>Dave Ananth is a Partner at Meridian Partners. DaveTaxNZ is Dave’s personal professional information, publication and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p><div><a href={phoneHref} data-event="call_click">Mobile: {phoneDisplay}</a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click">WhatsApp Dave</a><a href={`mailto:${email}`} data-event="email_click">{email}</a><a href="https://mplaw.nz/about-meridian-partners/dave-ananth/" target="_blank" rel="noopener noreferrer">Meridian Partners</a><a href={sitePath("terms/")}>Terms</a><a href={sitePath("privacy/")}>Privacy</a><a href={sitePath("legal-disclaimer/")}>Legal &amp; engagement disclaimer</a></div><small>© 2026 Dave Ananth. Information on this site is general information, not advice. No outcome or timeframe is guaranteed.</small></footer>;
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
  const showFeaturedImage = article.image && !article.contentHtml?.includes(`src=\"${article.image}\"`);
  return <main id="main"><PageIntro eyebrow={`${article.subject} · ${article.type}`} title={article.title}>{article.publication} · {article.date}</PageIntro><article className="detail-page section-shell section-pad"><dl><div><dt>Publication</dt><dd>{article.publication}</dd></div><div><dt>Relationship</dt><dd>{article.relationship}</dd></div><div><dt>Published</dt><dd>{article.date}</dd></div></dl>{showFeaturedImage && <img className="article-featured" src={article.image} alt={article.imageAlt} width={article.imageWidth} height={article.imageHeight} />}{article.contentHtml ? <><p className="archive-note">Migrated from the original DaveTaxNZ publication archive. This is general information, not legal, tax or accounting advice.</p><div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /></> : <><p>{article.summary}</p><p>This record identifies the publication and Dave’s relationship to it from the linked source. It does not add or imply any unverified claim.</p></>}{article.sourceUrl && <ActionLink href={article.sourceUrl} external>View the original source</ActionLink>}<a className="text-link" href={sitePath("articles-media/")}>Return to the archive <ArrowRight size={18} /></a></article></main>;
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

function TestimonialsPage() {
  return <main id="main"><PageIntro eyebrow="Client experiences" title="Testimonials">Only exact, source-approved testimonial wording is published.</PageIntro><div className="legal-page testimonials-page section-shell section-pad"><blockquote>“Within just two days, the entire process was turned around.”</blockquote><p><strong>Jana R</strong><br />Student loan client · June 2025</p><blockquote>“Managed with reassurance, professionalism, trust and kindness.”</blockquote><p><strong>Sarah Williams</strong><br />Student loan client · October 2025</p><blockquote>“His generosity, empathy and kindness.”</blockquote><p><strong>Felicity McKeen</strong><br />Student loan client · April 2025</p><p className="outcomes-note">Testimonials describe individual experiences. Past outcomes do not guarantee future results.</p></div></main>;
}

function NotFound() {
  return <main id="main"><PageIntro eyebrow="404" title="Page not found">The page may have moved or the address may be incorrect.</PageIntro><div className="detail-page section-shell section-pad"><a className="text-link" href={sitePath()}>Return to the homepage <ArrowRight size={18} /></a></div></main>;
}

function HomePage() {
  return <><Proof /><AboutDave /><Expertise /><StoriesPreview /><InsightsPreview /><Contact /></>;
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
  else if (path === "testimonials") content = <TestimonialsPage />;
  else if (path === "privacy") content = <PrivacyPage />;
  else if (legalPages[path]) content = <LegalPage page={legalPages[path]} />;
  else content = <NotFound />;
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" className="dark-shell"><Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{!path && <main id="main"><Hero /></main>}</div>{content}<Footer /></>;
}
