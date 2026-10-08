import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

/** Rewrite only the compiled preview. Azure source URLs and local media stay intact. */
export function previewRewriter(routes, base, videoOrigin) {
  if (!/^\/[A-Za-z0-9._-]+$/.test(base)) throw new Error('Invalid Pages base path');
  const origin = new URL(videoOrigin);
  if (origin.protocol !== 'https:') throw new Error('Preview videos require HTTPS');
  const roots = new Set(['static', 'assets', '_astro', '_localized', 'api']);
  for (const page of routes) if (page.route !== '/') roots.add(page.route.split('/')[1]);
  const escaped = [...roots].map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const local = new RegExp('(?<=[="\'`(\\s,])/(?!/)(?:' + escaped + ')(?=[/"\'`?#\\s)\\\\]|$)', 'g');
  return text => text
    .replace(/(?<![\w:/])\/static\/[^\s"'<>`)]*\.mp4/g, path => origin.origin + path)
    .replace(local, path => base + path)
    .replace(/\b(href|action)=(['"])\/\2/g, (_, attr, quote) => attr + '=' + quote + base + '/' + quote)
    .replace(/((?:window\.)?location\.(?:href\s*=\s*|(?:assign|replace)\(\s*))(['"])\/\2/g,
      (_, before, quote) => before + quote + base + '/' + quote);
}

/** Materialize a static preview without Node endpoints or server language routing. */
export async function preparePages(directory, base, videoOrigin) {
  const routes = JSON.parse(await readFile('src/data/routes.json', 'utf8'));
  const rewrite = previewRewriter(routes, base, videoOrigin);
  let total = 0;
  async function visit(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
      const path = join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Pages artifact contains a symlink');
      if (entry.isDirectory()) { await visit(path); continue; }
      if (path.endsWith('.mp4')) { await unlink(path); continue; }
      if (/\.(html|css|js)$/.test(path) && !/[/\\]vendor[/\\].*\.js$/.test(path)) {
        let text = rewrite(await readFile(path, 'utf8'));
        if (path.endsWith('.html')) text = text.replace('</head>',
          '<meta name="robots" content="noindex,nofollow" /><meta name="crystal-preview" content="pages" />' +
          '<script src="' + base + '/assets/pages-language.js"></script></head>');
        await writeFile(path, text);
      }
      const bytes = await readFile(path);
      if (bytes.subarray(0, 80).toString().startsWith('version https://git-lfs.github.com/spec/v1'))
        throw new Error('Unresolved LFS object in Pages artifact: ' + path);
      total += bytes.length;
    }
  }
  await visit(directory);
  const mapping = {'/':'/en','/openEnd':'/_localized/en/openEnd','/ringSpun':'/_localized/en/ringSpun','/speciality':'/_localized/en/speciality'};
  const language = 'const base=' + JSON.stringify(base) + ';const mapping=' + JSON.stringify(mapping) + ';' +
    'const path=decodeURIComponent(location.pathname).slice(base.length).replace(/\\/(?:index\\.html)?$/, "")||"/";' +
    'if(/(?:^|;\\s*)django_language=en(?:;|$)/.test(document.cookie)&&mapping[path])' +
    'location.replace(base+mapping[path]+location.search+location.hash);';
  await writeFile(join(directory,'assets/pages-language.js'),language);
  await writeFile(join(directory,'robots.txt'),'User-agent: *\nDisallow: /\n');
  await writeFile(join(directory,'.nojekyll'),'');
  // Leave a margin below the documented 1 GB published-site limit.
  if (total > 950_000_000) throw new Error('Static preview exceeds Pages size budget');
  console.log('Pages preview prepared:', total, 'bytes; videos use the original HTTPS server.');
}
