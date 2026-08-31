import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url),'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('G-HN792X0368'));
function run(hostname) {
  const scripts = []; const context = { location:{hostname,origin:`https://${hostname}`,pathname:'/articles-media/example/',search:'?email=private@example.com',hash:'#private'},document:{referrer:'https://example.com/private?email=private@example.com',createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},Date,URL };
  context.window=context;vm.runInNewContext(script,context);return {scripts,calls:Array.from(context.dataLayer||[],c=>Array.from(c))};
}
test('production keeps the legacy property and configures the new property once, with one loader',()=>{
  for(const host of ['davetaxnz.nz','www.davetaxnz.nz']) {
    const {scripts,calls}=run(host);assert.equal(scripts.length,1);const configs=calls.filter(c=>c[0]==='config');assert.equal(configs.length,2);assert.deepEqual(configs.map(c=>c[1]),['G-HN792X0368','G-S4BDKMVWDC']);
    const current=configs[1][2];assert.equal(current.allow_google_signals,false);assert.equal(current.allow_ad_personalization_signals,false);assert.equal(current.page_location,`https://${host}/articles-media/example/`);assert.equal(current.page_referrer,'https://example.com');
    assert.equal(calls.filter(c=>c[0]==='event'&&c[1]==='page_view').length,0);
  }
});
test('local previews and the reporting hostname do not send public-site Analytics',()=>{
  for(const host of ['localhost','127.0.0.1','insights.davetaxnz.nz','shankarappan.github.io']) { const result=run(host);assert.equal(result.scripts.length,0);assert.equal(result.calls.length,0); }
});
