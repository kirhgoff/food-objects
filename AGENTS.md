# Project conventions

## Architecture

Fully static Astro 7 site, Bun, deployed to Cloudflare as static assets.

- `src/pages/`: routes that compose layouts and components.
- `src/layouts/`: thin page shells.
- `src/components/`: one responsibility each, with its own `<style>`.
- `src/content/`: Markdown per collection; schemas in `src/content.config.ts`.
- `src/lib/`: reused data, constants and helpers (`.ts`).
- `src/styles/`: `theme.css` tokens, `base.css` element defaults, `global.css` entrypoint.
- Imports use the `@/` alias.

## Core rules

- **Components over inline HTML.** Extract a component when markup repeats, has its own styles, or makes a page hard to scan. Pages assemble components; `Layout.astro` stays a thin shell, with head/meta, header and footer in their own components.
- **CSS lives beside its markup.** Component-specific styles go in that component's `<style>`. `global.css` holds only tokens, base element styles and genuinely shared utilities. Colours, spacing and fonts come from tokens in `theme.css`.
- **Data in `src/lib/`.** Nav items, links, site metadata and other repeated structures are typed arrays or objects in `src/lib/`, rendered by mapping. Templates hold no long hardcoded lists.
- **Named constants.** Magic numbers and strings get a name in `src/lib/` (or a CSS custom property for visual values).
- **Content is schema-checked.** Every collection has a zod schema with `draft: z.boolean().default(false)`. Pages read collections through `getPublished` in `src/lib/content.ts`, which drops drafts.
- **Soft size limits.** Refactor a component or page approaching ~150 lines and a stylesheet approaching ~250. Split earlier when a file mixes data, logic, markup and styles.
- **Reuse first.** Check `src/components/`, `src/lib/` and `src/styles/` before adding a parallel pattern.
- **Plain CSS and Markdown.** Tailwind and MDX are not used.
- **Deploy is manual and from committed code.** `bun run deploy` builds and runs `wrangler deploy`. Its `predeploy` guard refuses to run with uncommitted or untracked files.

## Growth rules

Recipes for each are in the `astro-growth` skill.

- **Someone other than the owner edits content** → add a `release` branch that deploys automatically via a GitHub Actions workflow using the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
- **The site gets a form, an API route or client-side logic** → add a Playwright smoke test that runs against the built site in CI.
- **An API route is needed** → add a Worker script (`main` in `wrangler.jsonc`) with `assets.run_worker_first` limited to the API paths.
- **The site is public and should be indexed** → set `site` in `astro.config.mjs` and add `@astrojs/sitemap` plus `public/robots.txt`.

## Checks

These must pass before every commit (CI runs the same):

```sh
bun run lint
bun run check
bun run build
```

The Stop hook runs `lint` and `check` when the tree is dirty.
