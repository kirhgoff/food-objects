---

name: astro-growth
description: Recipes for growing a seeded static Astro site. Use when a growth trigger fires: a non-owner starts editing content (release-branch deploy), the site gains a form, API route or client-side logic (Playwright smoke test), an API route is needed (Worker with run_worker_first), or the site goes public and indexable (sitemap).
user-invocable: false
---

Apply only the recipe whose trigger fired. Each is done when the checks in AGENTS.md pass and the stated extra check passes.

## Release-branch deploy

Create `.github/workflows/deploy-release.yml`, triggered on `push` to `release` and `workflow_dispatch`. Steps: `actions/checkout@v5`, `oven-sh/setup-bun@v2`, `bun install --frozen-lockfile`, `bun run build`, then `bunx wrangler deploy` with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from `secrets`. Create the `release` branch from `main` and ask the user to add both secrets in the repo settings.

Done when: the workflow file parses and the user has confirmed the secrets exist.

## Playwright smoke test

- `bun add -d @playwright/test`; `playwright.config.ts` with `webServer: { command: 'bun run build && bun run preview', url: 'http://localhost:4321' }` and `testDir: 'tests'`.
- One `tests/smoke.spec.ts` per interactive feature: load the page, exercise the form or script once, assert the visible result.
- Add `"test": "playwright test"` to scripts. In `check.yml`, after the build: `bunx playwright install --with-deps chromium` and `bun run test`.
- Add `test-results` and `playwright-report` to `.gitignore`.

Done when: `bun run test` passes locally.

## Worker for API routes

- Add `src/worker.ts` exporting `fetch(request, env)`: handle the API paths and return `env.ASSETS.fetch(request)` for everything else.
- In `wrangler.jsonc`, set `"main": "src/worker.ts"` and under `assets` add `"binding": "ASSETS"` and `"run_worker_first": ["/api/*"]`.
- Run `bunx wrangler types` and commit the generated `worker-configuration.d.ts`. Add the smoke test above for each route.

Done when: `bunx wrangler deploy --dry-run` succeeds and `bunx wrangler dev` answers the API path.

## Sitemap

- `bunx astro add sitemap`. Set `site: 'https://<domain>'` in `astro.config.mjs` (the same domain as `wrangler.jsonc`), and put that URL in a constant in `src/lib/` for page metadata.
- Add `public/robots.txt` with `Sitemap: https://<domain>/sitemap-index.xml`.
- Exclude drafts and private pages through the integration's `filter`.

Done when: `dist/sitemap-index.xml` exists after the build and lists only public pages.
