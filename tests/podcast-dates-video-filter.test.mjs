import test from 'node:test';
import assert from 'node:assert/strict';
import { clientMedia } from '../src/clientMedia.js';
import { mediaTypes } from '../src/articles.js';
import metadata from '../src/video-metadata.json' with { type: 'json' };

test('podcast clip dates match original video dates in New Zealand', () => {
  for (const slug of ['ird-tax-negotiation-when-discussions-stall', 'why-ird-tax-debt-grows', 'business-restructuring-and-ird-tax-debt', 'dave-ananth-notes-from-the-executive-full-interview']) {
    const record = clientMedia.find(item => item.slug === slug);
    const id = new URL(record.videoEmbedUrl).pathname.split('/').pop();
    const source = metadata.find(item => item.id === id);
    const parts = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(source.publishDate));
    const value = type => parts.find(part => part.type === type).value;
    assert.equal(record.isoDate, `${value('year')}-${value('month')}-${value('day')}`, slug);
  }
});

test('the uploaded video can be selected through the archive type filter', () => {
  const record = clientMedia.find(item => item.slug === 'tax-debt-restructure');
  assert.ok(mediaTypes.includes(record.type));
});
