# Azure deployment

Use independent Linux B1 App Services for development and production, each configured for Node.js 24 LTS. No deployment slots are required.

Configure Application Settings from `.env.example`, including `NODE_ENV=production`, all MasterBase settings, the exact allowed origins, and `PUBLIC_SITE_URL`. The public site URL and Turnstile site key must also be supplied at build time; Astro does not read runtime Application Settings into already-built static metadata.

Set startup to `npm start`, Always On enabled, HTTPS Only enabled, minimum inbound TLS 1.2, Health Check `/health`. Enable Application Insights through the App Service Node agent and configure its connection string in Application Settings. Validate instrumentation in the actual resource; this workspace does not have Azure or Azure DevOps access.

If MasterBase requires outbound IP allowlisting, configure regional VNet integration and the platform-provided NAT Gateway/static public IP. A private VNet by itself does not guarantee a fixed egress IP. Platform must confirm routing all SMTP traffic through the approved egress path and allowing TCP 587. Test actual internal delivery and confirmation using development settings before production cutover.

The supplied Azure DevOps pipeline checks out LFS, installs with `npm ci`, validates, builds Astro and TypeScript, tests, audits routes/assets and dependencies, then packages `dist/`, `server-dist/`, production dependencies and the lockfile. It deploys `dev` and `main` to separate resources and verifies `/health`. The deployment tasks deliberately have no App Settings or startup overrides.

Required pipeline variables: `azureServiceConnection`, `devAppName`, `prodAppName`, `publicSiteUrl`, `publicTurnstileSiteKey`. For environment-specific values, use the Azure DevOps variable groups/settings for each branch. Missing public Turnstile key should be an empty string, not a literal unresolved macro. Do not store SMTP credentials in the pipeline artifact or YAML.

The pipeline has not been run against Azure. Publishing `dev` requires an authenticated Git/LFS channel capable of uploading the original binary objects. The available repository API connection can read/write Git metadata but does not supply a Git/LFS upload credential.

## Preserve repository history when loading this migration

Work inside the existing authenticated clone; retain `.git`. Fetch and switch to `dev`, then fast-forward it from its remote head before copying the reviewed migration files. Remove the reviewed old frontend/Flask files, not `.git` or local configuration. The prior SMTP contract has been audited and migrated. Track the declared media patterns with LFS, stage the replacement, inspect the diff and confirm that all LFS objects exist locally before committing.

```sh
git fetch origin
git switch dev
git pull --ff-only origin dev
git lfs install
git add .gitattributes
git add .
git lfs status
npm ci
npm run check
npm run build
npm test
python3 scripts/audit_site.py
npm audit --audit-level=high
git commit -m "Migrate original Crystal website to Astro and Fastify"
git push origin dev
```

Git LFS's pre-push hook uploads binary objects before updating the Git branch. If it fails, fix authentication/quota and retry; do not disable the hook. `main` stays untouched until explicit visual approval.
