# Amanuel Eyob — Creative Web Developer Portfolio

I build immersive, high-performance web experiences.

React 18, TypeScript, Vite, React Three Fiber, drei, postprocessing, GSAP, the requested original Lenis package, Framer Motion, Tailwind, React Router, Zustand, React Hook Form, Zod, and Express/MySQL.

## Local development

```sh
npm install
npm install --prefix server
cp .env.example .env
cp server/.env.example server/.env
npm run dev
```

Run `cd server` then `npm run dev` in a second terminal. Frontend: http://localhost:5173. API: http://localhost:4000/api. Vite proxies `/api` for both dev and preview. PowerShell users can use `Copy-Item` instead of `cp`.

For XAMPP, start MySQL, set the actual database port/user/password in `server/.env`, and import `server/db/schema.sql` followed by `server/db/seed.sql`. Both requested SQL locations contain identical copies. From the MySQL CLI, use `SOURCE C:/absolute/path/server/db/schema.sql;` and then the seed file. The database name is `amanuel_portfolio`.

For interface work without MySQL/SMTP, explicitly set `DEMO_MODE=true`. Inquiries then persist to `server/.data/contacts.json`, and the UI explains that no email was sent. Production rejects demo mode. Set `DEMO_MODE=false` for the real database flow.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run build --prefix server
npm test
npm run preview
```

Strict TypeScript is enabled in both applications. The frontend build also checks Vite and Tailwind configuration. Preview runs on port 4173.

## Architecture

Routes are `/`, `/work`, `/about`, `/contact`, and `/work/:slug`. Below-fold sections use React.lazy/Suspense. GPU scenes mount near the viewport. Adaptive DPR and desktop-only effects control rendering cost. Mobile has 800 particles, native vertical panels, and a scroll-snap carousel. Reduced motion disables Lenis, pinning, parallax, drift, and automatic rotation.

Lenis uses the GSAP ticker as its only clock. ScrollTrigger contexts and event subscriptions clean up on unmount. Keyboard and touch retain native scrolling. The asset/font preloader runs once per browser tab session; clear `ae-loaded` in session storage to replay it.

The API uses validated inputs, prepared SQL statements, an origin allowlist, Helmet, JSON errors, request size limits, and rate limits. Inquiries are persisted before email notification. Pending emails retry every minute, at most five attempts. Monitor `contacts.mail_status` and `mail_attempts`; after fixing SMTP, reset exhausted attempts operationally. At-least-once delivery may send duplicate mail after a crash; inquiry IDs appear in subjects. Use a shared rate-limit store before running multiple API replicas.

## Content

The six projects are original concept examples, with local SVG interface artwork and working local case-study pages. Testimonials are visibly labeled fictional. The brief's metrics remain labeled unverified. Proficiency scores are editable self-assessments. Social links point to platform homepages until actual profile URLs are supplied. Empty repository URLs mean there is no public repository link. The portrait is an original illustration, not an actual photograph of Amanuel.

Replace the 1200 × 630 `public/og-image.jpg` with your final social cover, verify metrics, supply real profile URLs, and replace demo testimonials before publication. Clash Display and Inter are hosted locally under public/fonts with swap rendering and hero font preloads; source URLs are recorded alongside the files. Drei's city HDR and default 3D text font load remotely; host local copies if your deployment blocks those hosts. Procedural scenes do not require Draco or model downloads.

## Endpoints

- GET `/api/health`: real database readiness or explicit demo status.
- GET `/api/projects`: projects with technology arrays.
- GET `/api/projects/:slug`: one project or JSON 404.
- GET `/api/testimonials`: published testimonial records.
- POST `/api/contact`: validated inquiry, HTTP 201 after persistence.

See DEPLOYMENT.md and CONTRIBUTING.md for release and development guidance. No deployment occurs automatically.
