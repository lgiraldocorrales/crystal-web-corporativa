import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildApp } from '../server/app.js';
test('all retained and recovered routes respond, plus SEO files and legacy index redirects',async()=>{
  const routes=JSON.parse(await readFile('src/data/routes.json','utf8')) as {route:string}[];
  const app=await buildApp();
  try {
    for(const route of routes) {
      const response=await app.inject({method:'GET',url:route.route});
      assert.equal(response.statusCode,200,route.route);
      assert.match(response.headers['content-type'] as string,/text\/html/);
      assert.match(response.headers['content-security-policy'] as string,/frame-ancestors 'none'/);
    }
    for(const route of ['/robots.txt','/sitemap.xml'])assert.equal((await app.inject({method:'GET',url:route})).statusCode,200);
    assert.equal((await app.inject({method:'GET',url:'/unknown-route'})).statusCode,404);
    const localized=await app.inject({method:'GET',url:'/openEnd',headers:{cookie:'django_language=en'}});
    assert.equal(localized.statusCode,200);assert.match(localized.body,/<html lang="en"/);
    const home=await app.inject({method:'GET',url:'/',headers:{cookie:'django_language=en'}});
    assert.equal(home.statusCode,200);assert.match(home.body,/<html lang="en"/);
  } finally {await app.close();}
});
