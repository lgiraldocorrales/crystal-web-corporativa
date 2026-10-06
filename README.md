# Crystal corporate web — redesign

Static-first bilingual website for Crystal S.A.S., with a small Python backend for the contact flow through MasterBase.

## Current milestone

- New Spanish and English Home pages.
- Brand-driven GSAP loader based on the Crystal needle/thread mark.
- GSAP ScrollTrigger editorial showcases for desktop and touch-native galleries for mobile.
- SEO foundation: one H1, canonical, hreflang, Open Graph, Organization and FAQPage JSON-LD.
- Accessibility foundation, including keyboard navigation and reduced-motion behavior.
- Secure Flask contact endpoint prepared for MasterBase SMTP on port 587.
- Security headers and strict request validation.

The remaining captured routes are the source inventory for the next milestone. They should be migrated into the new shared layout only after approval of the Home visual direction.

## Local build

```bash
npm install
npm run build
npm run check
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
gunicorn app:app --bind 0.0.0.0:8000
```

Open `http://localhost:8000`.

## Configuration

Copy `.env.example` into the deployment configuration. Never commit real MasterBase credentials. In Azure, secrets should be Key Vault references resolved through the App Service managed identity.

## Asset migration

The prototype deliberately references the current verified Crystal media URLs. Before production cutover, these files will be inventoried, optimized, uploaded to the new Blob Storage account and replaced at build time through `ASSET_BASE_URL`.

## Azure target

- Linux App Service.
- Blob Storage for public website media and documents.
- Regional VNet integration.
- NAT Gateway with one static public IP for MasterBase allowlisting.
- Key Vault references and system-assigned managed identity.
- HTTPS only, TLS 1.2+, FTPS disabled, remote debugging disabled.
