import test from 'node:test';
import assert from 'node:assert/strict';
import { previewRewriter, preparePages } from '../scripts/pages-preview.mjs';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const rewrite = previewRewriter([{route:'/quienesSomos'},{route:'/OurHistory/1938-1948'},{route:'/en'}],'/crystal-web-corporativa','https://www.crystal.com.co');
test('Pages preview prefixes navigation, assets, srcset, CSS and language handlers without touching remote URLs', () => {
  const input = `<a href="/">Home</a><a href="/quienesSomos">About</a><img srcset="/static/a.png 1x, /static/b.png 2x"><style>.a{background:url(/static/a.png)}</style><script>window.location.href="/en";const separator='/';</script><a href="https://example.com/en">External</a>`;
  const output = rewrite(input);
  assert.match(output,/href="\/crystal-web-corporativa\/"/);
  assert.match(output,/href="\/crystal-web-corporativa\/quienesSomos"/);
  assert.match(output,/\/crystal-web-corporativa\/static\/b.png/);
  assert.match(output,/url\(\/crystal-web-corporativa\/static\/a.png\)/);
  assert.match(output,/location.href="\/crystal-web-corporativa\/en"/);
  assert.match(output,/separator='\/'/);
  assert.match(output,/https:\/\/example.com\/en/);
});
test('Pages packaging adds preview markers, blocks indexing, removes video payloads and rejects unresolved LFS objects', async () => {
  const directory = await mkdtemp(join(tmpdir(),'crystal-pages-'));
  try {
    await mkdir(join(directory,'assets'));
    await writeFile(join(directory,'index.html'),'<html><head></head><body><a href="/">Home</a></body></html>');
    await writeFile(join(directory,'video.mp4'),'version https://git-lfs.github.com/spec/v1\n');
    await preparePages(directory,'/crystal-web-corporativa','https://www.crystal.com.co');
    assert.match(await readFile(join(directory,'index.html'),'utf8'),/crystal-preview/);
    assert.match(await readFile(join(directory,'robots.txt'),'utf8'),/Disallow: \//);
    await assert.rejects(access(join(directory,'video.mp4')));
    assert.match(await readFile(join(directory,'assets/pages-language.js'),'utf8'),/django_language=en/);
    await writeFile(join(directory,'missing.png'),'version https://git-lfs.github.com/spec/v1\n');
    await assert.rejects(preparePages(directory,'/crystal-web-corporativa','https://www.crystal.com.co'),/Unresolved LFS object/);
  } finally { await rm(directory,{recursive:true,force:true}); }
});
test('Pages preview serves the exact original video URLs and does not prefix twice', () => {
  const output = rewrite('<video src="/static/store/images/videos/Crystal_sostenible_2021.mp4"></video><script src="/crystal-web-corporativa/_astro/x.js"></script>');
  assert.match(output,/https:\/\/www.crystal.com.co\/static\/store\/images\/videos\/Crystal_sostenible_2021.mp4/);
  assert.doesNotMatch(output,/crystal-web-corporativa\/crystal-web-corporativa/);
  assert.throws(()=>previewRewriter([],'../bad','https://www.crystal.com.co'));
});
