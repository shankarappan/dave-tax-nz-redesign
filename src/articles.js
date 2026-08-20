import { wordpressArticles } from "./wordpressArticles.js";

// External records that were never standalone DaveTaxNZ WordPress posts.
// Keep publisher titles, dates and source URLs exact.
const externalArticles = [
  { slug: "rnz-half-a-million-people-owe-tax", subject: "IRD Tax Debt", type: "Media Coverage", publication: "RNZ", relationship: "Coverage about tax debt and Inland Revenue", date: "11 August 2026", isoDate: "2026-08-11", title: "Over half a million people owe tax. How did this happen?", summary: "RNZ examines how tax debt accumulated and what Inland Revenue’s debt book means for taxpayers.", url: "https://www.rnz.co.nz/news/business/957513/over-half-a-million-people-owe-tax-how-did-this-happen" },
  { slug: "rnz-overdue-tax", subject: "IRD Tax Debt", type: "Media Interviews", publication: "RNZ", relationship: "Quotes Dave Ananth", date: "1 July 2026", isoDate: "2026-07-01", title: "What should you do about overdue tax?", summary: "RNZ reports on Inland Revenue enforcement and practical steps for taxpayers with overdue tax.", url: "https://www.rnz.co.nz/news/personal-finance/650497/what-should-you-do-about-overdue-tax" },
  { slug: "interest-overseas-student-loans", subject: "Student Loans", type: "Media Coverage", publication: "Interest.co.nz", relationship: "Quotes Dave Ananth", date: "2026", isoDate: "2026", title: "Overseas student loan debt is keeping skilled Kiwis from returning home", summary: "Interest.co.nz reports on growing overseas student-loan balances and their effect on New Zealanders abroad.", url: "https://www.interest.co.nz/business/138466/dave-ananth-says-overseas-student-loan-problem-not-just-about-losing-money-its-also" },
];

export const articles = [...wordpressArticles, ...externalArticles].sort((a, b) => b.isoDate.localeCompare(a.isoDate));

export const subjects = ["Student Loans", "IRD Tax Debt", "Tax Policy", "Crypto Tax", "Other Commentary"];
export const mediaTypes = ["Articles by Dave", "Media Interviews", "Media Coverage", "Community Columns", "Podcasts"];
