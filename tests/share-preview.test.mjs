import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const path=new URL('../dist/client/owner-insights/index.html',import.meta.url);
test('public share page exposes only static branding and links to protected sign-in',async()=>{
  const html=await readFile(path,'utf8');
  assert.match(html, /property="og:image" content="https:\/\/davetaxnz.nz\/assets\/owner-insights-share-v1.jpg"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /href="https:\/\/insights.davetaxnz.nz\/"/);
  assert.match(html, /name="robots" content="noindex, follow"/);
  assert.doesNotMatch(html, /<script|http-equiv="refresh"|api\/report|GOOGLE_SERVICE_ACCOUNT|ALLOWED_EMAILS|info@infiniteminds/);
  assert.doesNotMatch(html, /__PAGE_/);
  await stat(new URL('../dist/client/owner-insights/share.css',import.meta.url));
});
test('share thumbnail is a small publicly packaged JPEG, not a protected dashboard asset',async()=>{
  const file=new URL('../dist/client/assets/owner-insights-share-v1.jpg',import.meta.url);
  const bytes=await readFile(file);assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);assert.ok(bytes.length<500_000);
});
