import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const repositoryBase = '/crystal-web-corporativa';
const repositoryBaseName = repositoryBase.slice(1);
const textExtensions = new Set(['.css', '.html', '.js']);

/**
 * Recursively returns build files that may contain root-relative URLs.
 *
 * @param {string} directory Build directory to inspect.
 * @returns {Promise<string[]>} Text files found below the directory.
 */
async function findTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findTextFiles(path);
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  }));

  return nestedFiles.flat();
}

/**
 * Prefixes literal root URLs left by the preserved legacy markup.
 * Astro handles imported assets using `base`; this step covers URLs written
 * directly in HTML, CSS and progressive-enhancement JavaScript.
 *
 * @param {string} source Compiled text asset.
 * @returns {string} Asset with GitHub Project Pages-compatible URLs.
 */
function addRepositoryBase(source) {
  const rootPath = new RegExp(`(["'])\\/(?!\\/|${repositoryBaseName}(?:\\/|["']))(?=[A-Za-z0-9_])`, 'g');
  const cssUrl = new RegExp(`url\\((["']?)\\/(?!\\/|${repositoryBaseName}(?:\\/|["']))`, 'g');
  const homeAttribute = /(\b(?:href|src|action|poster)=)(["'])\/\2/g;
  const embeddedAssetPath = /(^|["'(,\s])\/(static|assets)\//gm;

  return source
    .replace(homeAttribute, `$1$2${repositoryBase}/$2`)
    .replace(rootPath, `$1${repositoryBase}/`)
    .replace(embeddedAssetPath, `$1${repositoryBase}/$2/`)
    .replace(cssUrl, `url($1${repositoryBase}/`);
}

// GitHub Pages has a 1 GB published-site limit. Videos remain available in the
// Azure deployment and are deliberately excluded only from this preview build.
await rm(join(outputDirectory, 'static/store/images/videos'), { recursive: true, force: true });

for (const file of await findTextFiles(outputDirectory)) {
  let source = await readFile(file, 'utf8');
  source = addRepositoryBase(source);

  if (extname(file) === '.html') {
    source = source.replace(
      '<head>',
      '<head>\n    <meta name="robots" content="noindex,nofollow,noarchive" />',
    );
  }

  await writeFile(file, source);
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, '.nojekyll'), '');
await writeFile(join(outputDirectory, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const outputStats = await stat(outputDirectory);
if (!outputStats.isDirectory()) throw new Error('GitHub Pages output directory was not created.');
