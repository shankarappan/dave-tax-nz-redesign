import test from 'node:test';
import assert from 'node:assert/strict';
import { clientMedia } from '../src/clientMedia.js';
import { mediaSchema } from '../src/media-schema.mjs';

test('Platform interview keeps its original date and broadcaster attribution', () => {
  const article = clientMedia.find(item => item.slug === 'platform-dave-ananth-overseas-student-loan-debt');
  assert.equal(article.isoDate, '2025-07-04');
  const video = mediaSchema(article, 'https://davetaxnz.nz', 'https://davetaxnz.nz/articles-media/' + article.slug + '/').find(node => node['@type'] === 'VideoObject');
  assert.equal(video.publisher.name, 'The Platform NZ');
  assert.equal(video.isPartOf, undefined);
  assert.match(video.embedUrl, /Yajw0Om4amY$/);
});
