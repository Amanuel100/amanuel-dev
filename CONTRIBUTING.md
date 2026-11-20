# Contributing

Install root and server dependencies, copy their environment examples, and start both dev servers. Use demo mode for interface work; use MySQL/SMTP for changes to persistence or delivery.

Name branches `feat/short-description`, `fix/short-description`, or `docs/short-description`. Use focused commits such as `feat: add project detail navigation` and `fix: restore reduced-motion scrolling`.

Before opening a PR, run root lint/typecheck/build/tests and server typecheck/build. Include desktop/mobile screenshots for visual changes. Check keyboard order, reduced motion, route changes, and narrow layouts.

Never commit credentials, inquiry data, build output, or fabricated claims presented as real client work. Use strict TypeScript without explicit `any`. Revert GSAP contexts and remove subscriptions on unmount. Keep smooth scrolling on the GSAP ticker, with no extra Lenis animation loop.

Keep frontend data, backend JSON fixtures, and both SQL seed copies synchronized. Preserve native touch scrolling and readable reduced-motion content.
