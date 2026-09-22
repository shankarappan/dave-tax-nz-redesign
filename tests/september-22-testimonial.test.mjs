import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { testimonials } from "../src/testimonials.js";

const annetteFlinthamTestimonial = {
  name: "Annette Flintham",
  date: "September 2026",
  quote: "My experience with Dave has without hesitation revived my trust in human nature. This man, a barrister, a professional man, listened, gave me the time and confidence to discuss various issues that have plagued me and my son for many years with no end in sight, no peace was to be had. Dave in his calm relaxed yet professionalism gave sound and encouraging advice. A man I consider a gem to the profession, to his Firm, to himself, someone I would call without a second thought. I cannot rate Dave high enough. Thank you Dave you are etched in my mind for ever.",
};

test("Annette Flintham testimonial is preserved exactly and listed first", () => {
  assert.deepEqual(testimonials[0], annetteFlinthamTestimonial);
  assert.equal(
    testimonials.filter(({ name }) => name === "Annette Flintham").length,
    1,
  );
});

test("Annette Flintham testimonial is rendered with its disclosure control", async () => {
  const html = await readFile(
    new URL("../dist/client/testimonials/index.html", import.meta.url),
    "utf8",
  );
  const firstCard = html.match(/<article class="testimonial-card"[\s\S]*?<\/article>/)?.[0] ?? "";

  assert.match(firstCard, /Annette Flintham/);
  assert.match(firstCard, /September 2026/);
  assert.match(firstCard, /revived my trust in human nature/);
  assert.match(firstCard, /etched in my mind for ever/);
  assert.match(firstCard, /aria-controls="testimonial-0"/);
});
