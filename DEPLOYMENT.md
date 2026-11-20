# Deployment

## Prepare the release

Set the canonical domain in `VITE_SITE_URL`, index.html, robots.txt, and sitemap.xml. Replace `public/og-image.jpg` with the final 1200 × 630 cover. Supply real profile URLs and portrait, verify metrics, and replace fictional testimonials with approved quotes. Concept work is labeled explicitly.

Run frontend lint/typecheck/build/tests and server typecheck/build. Verify live MySQL and SMTP separately from demo mode.

## MySQL on Railway or PlanetScale

Provision a MySQL-compatible database, copy its host, port, database, user, and password to the backend environment, and import `server/db/schema.sql` followed by `server/db/seed.sql`. For a provider-created database, omit CREATE DATABASE and USE statements and select the database through the client. Use migration credentials for imports and a limited application account for runtime SELECT/INSERT/UPDATE.

Railway services in the same project can use private networking. For public connections enable `DB_SSL=true` when supported. Do not disable certificate validation. If choosing PlanetScale, confirm the current MySQL-compatible product and foreign-key support before provisioning. This schema does not target PostgreSQL. Set up backups and restore testing.

## Backend on Railway or Render

Use repository root `server`. Build from its Dockerfile or use `npm ci && npm run build`, then `npm start`. Configure `/api/health` as the readiness check. Set all values from `server/.env.example`, with `NODE_ENV=production`, `DEMO_MODE=false`, real DB/SMTP credentials, and verified MAIL_FROM/MAIL_TO addresses.

Use the provider's TLS SMTP settings (usually 465 with SMTP_SECURE=true or STARTTLS on 587 with SMTP_SECURE=false). Confirm delivery from an authorized sender domain. Store secrets only in the hosting environment, never in VITE variables.

Set CORS_ORIGIN to the exact frontend HTTPS origin(s), comma-separated. Set TRUST_PROXY to the documented trusted proxy-hop count; never blindly trust every proxy. The included Dockerfile uses the requested node:20-alpine and runs as non-root. Check Node's support schedule and move to a supported LTS before a public release.

POST a real inquiry and verify HTTP 201, the contacts row, mail_status='sent', and inbox receipt. Monitor exhausted mail attempts. A process-local rate limiter is included; use a shared store before horizontal scaling.

## Frontend on Vercel

Import the repo with the Vite preset, root at the repository root, build command `npm run build`, and output `dist`. The included vercel.json provides SPA rewrites and security headers.

Set `VITE_API_URL=/api` and `VITE_SITE_URL=https://your-portfolio-domain`. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL` to Vercel's Production environment variables. The contact form is served by `api/contact.js`, which sends mail through Resend; do not expose the API key as a `VITE_` variable. Rebuild after changes because the Vite values are compiled into the bundle.

Attach your domain, enable HTTPS, and update backend CORS. Verify direct visits to /work, /about, /contact, and /work/nile-analytics. Check the form request reaches the API host rather than the SPA fallback. Allow preview origins individually only when they need API access.

## Final checks

Run Lighthouse on the built preview and deployed site. Record actual scores and device settings. Verify 375px layouts, keyboard navigation, reduced motion, GPU fallback, and all pinned sections on physical hardware. Frame rate is device-dependent. Never treat demo-mode persistence as proof of live mail delivery.
