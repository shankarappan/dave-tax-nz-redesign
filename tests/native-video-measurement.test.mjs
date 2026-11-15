import test from 'node:test';
import assert from 'node:assert/strict';
import { installMediaAnalytics } from '../src/media-analytics.js';

test('native video measurement uses the owner stream, excludes URL queries and deduplicates milestones', t => {
  const names = ['window', 'document', 'location', 'MutationObserver'];
  const saved = Object.fromEntries(names.map(name => [name, globalThis[name]]));
  t.after(() => names.forEach(name => saved[name] === undefined ? delete globalThis[name] : globalThis[name] = saved[name]));
  const listeners = new Map();
  const emitted = [];
  globalThis.window = { gtag: (...args) => emitted.push(args) };
  globalThis.location = { href: 'https://davetaxnz.nz/articles-media/tax-debt-restructure/?private=test', pathname: '/articles-media/tax-debt-restructure/' };
  globalThis.document = { addEventListener: (name, fn) => listeners.set(name, fn), getElementById: () => ({}) };
  globalThis.MutationObserver = class { observe() {} };
  installMediaAnalytics('G-S4BDKMVWDC');
  const video = { tagName: 'VIDEO', currentSrc: 'https://davetaxnz.nz/assets/videos/tax-debt-restructure.mp4?private=test', currentTime: 0, duration: 100 };
  listeners.get('play')({ target: video });
  listeners.get('play')({ target: video });
  video.currentTime = 51;
  listeners.get('timeupdate')({ target: video });
  listeners.get('timeupdate')({ target: video });
  listeners.get('ended')({ target: video });
  assert.deepEqual(emitted.map(row => row[1]), ['media_video_start', 'media_video_progress', 'media_video_progress', 'media_video_complete']);
  assert.deepEqual(emitted.filter(row => row[1] === 'media_video_progress').map(row => row[2].video_percent), [25, 50]);
  for (const row of emitted) {
    assert.equal(row[2].send_to, 'G-S4BDKMVWDC');
    assert.equal(row[2].video_id, '/assets/videos/tax-debt-restructure.mp4');
    assert.equal(row[2].page_path, '/articles-media/tax-debt-restructure/');
    assert.ok(!JSON.stringify(row).includes('private='));
  }
});
