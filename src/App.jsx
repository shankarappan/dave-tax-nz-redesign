import { useMemo, useState } from "react";
import { ArrowRight, Check, EnvelopeSimple, FileText, GlobeHemisphereWest, List, Phone, Quotes, ShieldCheck, Student, X } from "@phosphor-icons/react";
import { articles } from "./articles";

const phoneDisplay = "+64 21 021 68888";
const phoneHref = "tel:+64210216888";
const email = "dave@davetaxnz.nz";

function ActionLink({ href, children, secondary = false, external = false }) {
  return <a className={secondary ? "button button--secondary" : "button"} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
}

function Header({ menuOpen, setMenuOpen }) {
  const close = () => setMenuOpen(false);
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Dave Ananth home" onClick={close}><img src="assets/dave-ananth-logo.webp" alt="Dave Ananth, Tax Barrister" width="150" height="130" /></a>
    <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}><span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X size={26} /> : <List size={28} />}</button>
    <nav id="site-nav" className={menuOpen ? "nav nav--open" : "nav"} aria-label="Primary navigation">
      <a href="#about" onClick={close}>About Dave</a><a href="#expertise" onClick={close}>Expertise</a><a href="#stories" onClick={close}>Client stories</a><a href="#insights" onClick={close}>Articles &amp; media</a><a href="#contact" onClick={close}>Contact</a>
    </nav>
    <ActionLink href="https://davetaxnz.nz/book-a-consultation/" external>Discuss your student loan</ActionLink>
  </header>;
}

function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero__copy"><p className="eyebrow">Dave Ananth · Partner at Meridian Partners · Former Inland Revenue Prosecutor</p><h1 id="hero-title">Student Loan Lawyer NZ and IRD Negotiator</h1><div className="accent-rule" aria-hidden="true" /><p className="hero__lead">Practical legal advice for overseas New Zealanders dealing with long-standing student-loan debt, penalties, repayment demands and possible IRD enforcement.</p>
      <a className="alert-link" href="#expertise"><ShieldCheck size={35} weight="light" /><span>Living overseas with New Zealand student-loan debt? Review the practical options.</span><ArrowRight size={20} /></a>
      <div className="button-row"><ActionLink href="https://davetaxnz.nz/book-a-consultation/" external>Discuss your student loan with Dave</ActionLink><ActionLink href={phoneHref} secondary><Phone size={21} weight="fill" /> Call Dave</ActionLink></div>
    </div>
    <div className="hero__portrait"><img src="assets/dave-ananth-hero.webp" alt="Dave Ananth, student-loan lawyer and IRD negotiator" width="1280" height="1198" /><div className="portrait-caption"><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span><small>Former Inland Revenue Prosecutor</small></div></div>
  </section>;
}

function Proof() {
  return <section className="proof section-shell" aria-label="Approach and media"><div className="quote-mark"><Quotes size={45} weight="fill" aria-hidden="true" /></div><blockquote>“Every matter depends on its own facts, the available evidence and Inland Revenue’s decision. No particular outcome or timeframe can be guaranteed.”</blockquote>
    <div className="proof__identity"><img src="assets/dave-ananth-profile.webp" alt="Dave Ananth" width="1280" height="1280" /><p><strong>Dave Ananth</strong><span>Partner, Meridian Partners</span></p></div>
    <div className="proof__media"><img src="assets/media-lockup.png" alt="As seen in Newstalk ZB, Stuff, NZ Lawyer and The Post" width="402" height="85" /></div>
  </section>;
}

const principalAreas = [
  "Overseas-based student-loan borrowers",
  "Long-standing student-loan arrears",
  "Penalties and interest",
  "Repayment and settlement proposals",
  "Remission applications",
  "Hardship and medical circumstances",
  "IRD communication and negotiation",
  "Enforcement and border-risk assessment",
];

const publicRoles = [
  "Partner, Meridian Partners",
  "Former Inland Revenue solicitor and prosecutor",
  "Former Malaysian Magistrate and Judicial Officer",
  "Former Director, EY Malaysia",
  "Honorary Consul of Timor-Leste",
  "President, New Zealand Malaysian Business Association",
  "Honorary Advisor, ASEAN Region, Auckland Business Chamber",
];

function AboutDave() {
  return <section id="about" className="about section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">About Dave</p><h2>Dave Ananth — Student Loan Lawyer and IRD Negotiator</h2><p>DaveTaxNZ is Dave’s personal professional information and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p></div>
    <div className="about__grid"><div className="about__copy"><p>Dave Ananth is an Auckland-based lawyer whose principal practice is helping overseas New Zealanders resolve long-standing student-loan debt with Inland Revenue.</p><p>Many clients left New Zealand years or decades ago. During that period, their student-loan balances increased through overseas interest, missed obligations and late-payment penalties. Some are frightened to contact Inland Revenue, worried about travelling to New Zealand, or uncertain whether any practical resolution remains available.</p><p>Dave reviews the history of each matter, identifies realistic options and, where formally engaged, communicates and negotiates with Inland Revenue on the borrower’s behalf.</p><p>Dave is a former Inland Revenue solicitor and prosecutor and has more than 35 years of legal experience in New Zealand and Malaysia. He is presently a Partner at Meridian Partners in Auckland.</p><a className="text-link" href="https://davetaxnz.nz/student-loan-negotiations/" target="_blank" rel="noreferrer">Learn how Dave assesses overseas student-loan matters <ArrowRight size={18} /></a></div>
      <div className="about__list"><h3>Dave’s principal areas of work</h3><ul>{principalAreas.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="about__list about__list--roles"><h3>Professional and public roles</h3><ul>{publicRoles.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div>
  </section>;
}

const expertise = [
  { icon: Student, title: "Review the loan history", text: "Reviewing long-standing balances, repayment histories, accumulated interest and penalties, including illness, hardship and family circumstances.", href: "https://davetaxnz.nz/student-loan-negotiations/" },
  { icon: FileText, title: "Engage with Inland Revenue", text: "Where formally engaged, Dave may communicate with IRD, prepare remission applications where proper grounds exist, and present repayment or settlement proposals.", href: "https://davetaxnz.nz/student-loan-negotiations/" },
  { icon: GlobeHemisphereWest, title: "Assess return and enforcement risks", text: "Assessing possible enforcement or border risks and advising overseas borrowers who want to return to New Zealand. No outcome or timeframe can be guaranteed.", href: "https://davetaxnz.nz/student-loan-negotiations/" },
];

function Expertise() {
  return <section id="expertise" className="expertise section-shell section-pad"><div className="section-heading"><p className="eyebrow eyebrow--red">Principal practice</p><h2>How Dave helps overseas student-loan borrowers</h2><p>Dave advises on engaging with Inland Revenue, seeking penalty relief where appropriate, presenting repayment or settlement proposals, and assessing possible enforcement or border risks.</p></div>
    <div className="expertise-grid">{expertise.map(({ icon: Icon, title, text, href }, index) => <a className="expertise-item" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={title}><span className="expertise-item__number">0{index + 1}</span><Icon size={34} weight="light" /><h3>{title}</h3><p>{text}</p><span className="text-link">Learn more <ArrowRight size={18} /></span></a>)}</div>
    <aside className="tax-debt-note"><div><p className="eyebrow eyebrow--red">Secondary service</p><h3>Occasional IRD tax-debt negotiation</h3></div><p>Dave occasionally accepts other tax-debt negotiation matters where a practical resolution with Inland Revenue may be possible. He does not provide accounting services, tax-return preparation or tax litigation. <a href="https://davetaxnz.nz/ird-disputes-tax-penalties-negotiation/" target="_blank" rel="noreferrer">Read the limited scope of this service</a>.</p></aside>
    <p className="outcomes-note">Past outcomes do not guarantee future results. Inland Revenue considers each application and proposal on its own facts.</p>
  </section>;
}

function Stories() {
  return <section id="stories" className="stories"><div className="section-shell stories__inner"><div><p className="eyebrow eyebrow--gold">Testimonials</p><h2>Student Loan Client Experiences</h2></div><div className="story-copy"><p>These testimonials describe individual client experiences. Every student-loan matter is different, and previous outcomes do not guarantee that the same result will be available in another case.</p><blockquote>“Within just two days, the entire process was turned around.”</blockquote><p className="story-credit"><strong>Jana R</strong><span>Student loan client · June 2025</span></p><div className="story-links"><a className="text-link text-link--light" href="https://davetaxnz.nz/testimonials/" target="_blank" rel="noreferrer">Read genuine client testimonials <ArrowRight size={18} /></a><a className="text-link text-link--light" href="https://davetaxnz.nz/book-a-consultation/" target="_blank" rel="noreferrer">Book a free initial call <ArrowRight size={18} /></a></div></div></div></section>;
}

function Insights() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const filters = ["All", ...new Set(articles.map((article) => article.collection))];
  const visible = useMemo(() => { const search = query.trim().toLowerCase(); return articles.filter((article) => (filter === "All" || article.collection === filter) && (!search || [article.title, article.summary, article.publication, article.relationship].some((value) => value.toLowerCase().includes(search)))); }, [filter, query]);
  return <section id="insights" className="insights section-shell section-pad"><div className="insights__intro"><p className="eyebrow eyebrow--red">Latest thinking</p><h2>Media, Articles &amp; Student Loan Advice</h2><p>Searchable guidance and coverage written by Dave, quoting Dave, or discussing his work. The archive is structured for regular updates.</p><a className="text-link" href="#expertise">See Dave’s principal student-loan practice <ArrowRight size={18} /></a></div>
    <div className="insights__tools"><label htmlFor="article-search">Search the archive</label><input id="article-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, publications and topics" /></div>
    <div className="filters" aria-label="Filter articles">{filters.map((item) => <button type="button" className={filter === item ? "filter filter--active" : "filter"} onClick={() => setFilter(item)} aria-pressed={filter === item} key={item}>{item}</button>)}</div>
    <div className="article-grid">{visible.map((article) => <article className="article-card" key={article.url}><div className="article-meta"><span>{article.publication}</span><time dateTime={article.isoDate}>{article.date}</time></div><h3>{article.title}</h3><p>{article.summary}</p><span className="article-type">{article.relationship}</span><div className="article-actions"><a className="text-link" href={article.url} target="_blank" rel="noreferrer">Read at {article.publication} <ArrowRight size={18} /></a><a className="text-link text-link--muted" href="#about">About Dave</a></div></article>)}</div>
    {!visible.length && <p className="article-empty">No articles match this search. Try another publication or topic.</p>}
  </section>;
}

function Contact() {
  return <section id="contact" className="contact"><div className="section-shell contact__grid"><div><p className="eyebrow eyebrow--gold">Contact Dave</p><h2>Discuss your student loan with Dave</h2><p>Free 15-minute initial consultation. Dave will tell you whether he can assist and whether formal representation is likely to add value.</p></div>
    <div className="contact__links"><a href={phoneHref}><Phone size={27} weight="fill" /><span><small>Call Dave directly</small>{phoneDisplay}</span></a><a href={`mailto:${email}`}><EnvelopeSimple size={27} weight="fill" /><span><small>Email Dave</small>{email}</span></a><a href="https://www.google.com/maps/search/?api=1&query=97+Great+South+Road+Epsom+Auckland+1051" target="_blank" rel="noreferrer"><GlobeHemisphereWest size={27} /><span><small>Auckland office</small>97 Great South Road, Epsom</span></a></div>
    <div className="contact__action"><Check size={28} weight="bold" /><p>Past outcomes do not guarantee future results. Inland Revenue determines the outcome of every application and proposal.</p><ActionLink href="https://davetaxnz.nz/book-a-consultation/" external>Book a free initial call</ActionLink></div>
  </div></section>;
}

function Footer() {
  return <footer className="footer section-shell"><img src="assets/dave-ananth-logo.webp" alt="Dave Ananth Tax Barrister" width="120" height="105" /><p>Dave Ananth is a Partner at Meridian Partners. DaveTaxNZ is Dave’s personal professional information and media platform. Formal legal services and engagements are presently provided through Meridian Partners.</p><div><a href={phoneHref}>Mobile: {phoneDisplay}</a><a href={`mailto:${email}`}>{email}</a><a href="https://www.google.com/maps/search/?api=1&query=97+Great+South+Road+Epsom+Auckland+1051" target="_blank" rel="noreferrer">97 Great South Road, Epsom, Auckland 1051</a><a href="https://mplaw.nz/about-meridian-partners/dave-ananth/" target="_blank" rel="noreferrer">Meridian Partners</a><a href="https://www.linkedin.com/in/dave-ananth-6310b023/" target="_blank" rel="noreferrer">LinkedIn</a></div><small>© 2026 Dave Ananth. Information on this site is general and does not guarantee any legal or Inland Revenue outcome.</small></footer>;
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top" className="dark-shell"><Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><main id="main"><Hero /></main></div><Proof /><AboutDave /><Expertise /><Stories /><Insights /><Contact /><Footer /></>;
}
