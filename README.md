# Crystal — migration of the existing corporate website

This is a faithful migration of the supplied HAR-derived HTML capture, not the unapproved redesign. The original 38 pages remain separate. Missing linked pages were recovered from the live site with the appropriate Django language cookie. Source content, media bytes, navigation hierarchy and desktop/mobile menu differences are retained. `src/data/routes.json` records each page's provenance.

## Run

Requires Node.js 24 LTS and Git LFS. After cloning the original repository on `dev`:

```sh
git lfs install
git lfs pull
npm ci
npm run check
npm run build
npm test
npm start
```

`npm run dev` builds the static site and runs the Fastify backend through Node's watcher. Refresh the build after changing Astro content. One Node process serves `dist/`, `/health` and `/api/contact`. Production listens on `process.env.PORT` and `0.0.0.0`.

Copy `.env.example` to `.env` for local development. Production configuration uses Azure App Service Application Settings. Missing critical production configuration prevents startup with a generic error. Never commit real credentials.

## Structure and fidelity

- `src/components/Page_*.astro`: native page templates; no generated HTML strings or framework hydration.
- Separate desktop/mobile header and footer components preserve each source version.
- `src/layouts/OriginalLayout.astro`: shared language and SEO.
- `src/data/routes.json`: exact routes, language counterparts, source titles and descriptions reused from source paragraphs.
- `public/static`: unchanged local Crystal media/documents; tracked with Git LFS.
- `public/assets`: locally retained vendor scripts, fonts and progressive enhancements.
- `server`: strict TypeScript Fastify server, security, validation and mail service.
- `tests`: simulated mail, security and route verification.

The original scripts use Materialize, jQuery and AOS. These are retained for behavior parity. GSAP is installed to honor the requested stack, but new animations are not introduced. The source does not implement a dark theme. The original declared fonts are Brandon Grotesque and Neue Helvetica; no replacement brand typeface is introduced.

Run `python3 scripts/audit_site.py` after building to validate local links, assets, primary headings and SEO files. The one-time Python source importer is a development audit utility requiring BeautifulSoup and Pillow; normal build and runtime do not use Python.

## Contact and safety

The original fields are `dirigido`, `nombre`, `apellido`, `email`, `empresa`, `mensaje`, `idioma`, and personal-data consent. JSON validation enforces source length limits, department values and consent. MasterBase uses authenticated SMTP 587, mandatory STARTTLS and TLS >=1.2. The two configured internal recipients receive all fields; the visitor receives the existing repository's localized confirmation.

Requests require a configured Origin. Rate limiting defaults to eight attempts per IP/hour, including invalid requests. Honeypot, 32 KiB body limit, length validation, text normalization, HTML escaping and generic errors protect the endpoint. Turnstile is activated when both keys are configured; the site key must also be available at build time. Logs omit form fields, SMTP errors and credential values.

CSP authorizes exact inline event-handler hashes and local scripts. Source inline styles require `style-src 'unsafe-inline'`; JavaScript does not broadly allow unsafe-inline/eval. External maps, existing PQRS integration, GTM and Turnstile have narrowly specified origins. PDF rendering uses the recovered original library with JavaScript expression evaluation disabled and a local worker; review that legacy vendor separately from npm dependency auditing.

## Deployment

See `docs/azure.md`. LFS objects must be uploaded before a branch can be published successfully. Do not push pointers whose binary objects have not been uploaded. Do not force push, rewrite history, create extra branches, or merge into `main` until Lucas explicitly approves visual parity.

### Temporary GitHub Pages preview

The workflow in `.github/workflows/pages.yml` publishes `main` as a static review site. In **Settings → Pages**, select **GitHub Actions** as the source once. The workflow uses the repository base path, prevents search indexing and omits the large videos so the artifact remains below GitHub Pages' 1 GB limit.

GitHub Pages cannot run Fastify or access App Service secrets. Therefore `/api/contact`, `/health`, SMTP delivery and Turnstile verification remain exclusive to the Node/Azure deployment; the contact form explains this limitation when used in the preview. Run `PUBLIC_STATIC_PREVIEW=true npm run build:pages` on Linux/macOS to reproduce the Pages artifact locally.

## Review status

This package is a review candidate, not an approved production replacement. See `docs/Informe_Migracion.md` and the JSON evidence. The audit intentionally blocks deployment while the original corrupt ethical-program image is retained. Live MasterBase, external widgets and the Azure DevOps deployment require validation in the configured development environment. Neither remote branch has been modified.
