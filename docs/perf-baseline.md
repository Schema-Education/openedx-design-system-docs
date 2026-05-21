# Performance Baseline

Captured 2026-05-21 from branch `chore/perf-audit` against [site/next.config.mjs](../site/next.config.mjs) at commit-tip of `main` plus the perf-audit edits (turbopack flag, `@next/bundle-analyzer` wire-up). The point of this document is to (a) record a baseline so future perf work has a real number to compare against and (b) make the vision-page-split decision data-driven rather than guessed.

## Methodology

- **Bundle analysis:** `pnpm --filter @openedx-design-system/site analyze` (Webpack Bundle Analyzer via `@next/bundle-analyzer`, gated behind `ANALYZE=true` so the analyzer is a no-op in normal CI builds).
- **Lighthouse:** captured against the Cloudflare Workers Assets preview deployment for this PR (not against `next dev` — dev-mode compile timing is a noisy artifact, not what end users experience). See [Lighthouse Baseline](#lighthouse-baseline) below.
- **Static export target:** `output: 'export'` in [site/next.config.mjs](../site/next.config.mjs) → served as static HTML+JS from Cloudflare per [site/wrangler.toml](../site/wrangler.toml). No server-rendered surface.

## Route-Level First Load JS

Reported by `next build` (gzipped, includes shared chunks):

| Route                       | Route-specific | First Load JS |
| --------------------------- | -------------: | ------------: |
| `/`                         |          162 B |        106 kB |
| `/_not-found`               |          996 B |        104 kB |
| `/api/search`               |          129 B |        103 kB |
| `/docs/[[...slug]]` (incl. `/docs/vision`, `/docs/atomic-design`, `/docs/getting-started`) | 5.89 kB | **148 kB** |
| `/registry`                 |     **170 kB** |    **304 kB** |
| `/registry/[...slug]` (62 subpaths) | 129 B  |        103 kB |
| Shared baseline             |              — |        103 kB |

## Largest Client Chunks

Per Webpack Bundle Analyzer (`site/.next/analyze/client.html`). Sizes are post-minification; `gzip` is the over-the-wire cost.

| Chunk                      | Parsed | Gzipped | Top contributors                                                                 |
| -------------------------- | -----: | ------: | -------------------------------------------------------------------------------- |
| Paragon registry chunk     | 467 KB |  146 KB | `@openedx/paragon` (235 KB), `@headlessui/react` (142 KB), `react-bootstrap` (28 KB), `@popperjs/core` (22 KB), registry components (95 KB) |
| Devbar + base-ui chunk     | 236 KB |   77 KB | `@sdaitzman/prototype-devbar` (147 KB), `@base-ui/react` (65 KB), `floating-ui-react` (36 KB) |
| `framework-*.js`           | 185 KB |   58 KB | `react-dom` (174 KB), `react` (8 KB)                                             |
| `28-*.js` (shared)         | 169 KB |   45 KB | Next.js client runtime                                                           |
| `f46d1f10-*.js` (shared)   | 169 KB |   53 KB | `react-dom-client.production.js`                                                 |
| `main-*.js`                | 125 KB |   36 KB | Next.js shared lib + client                                                      |
| `polyfills-*.js`           | 110 KB |       — | Legacy-browser polyfills                                                         |
| `app/registry/page-*.js`   |  73 KB |   18 KB | `gallery.tsx` (44 KB), `paragon-previews.tsx` (26 KB)                            |
| `659-*.js`                 |  52 KB |   18 KB | `fumadocs-core` static                                                           |

## Lighthouse Baseline

> **Pending.** Lighthouse will be captured against the Cloudflare preview URL once this PR publishes a deployment. Numbers will be appended to this section as a per-route table covering performance score, LCP, CLS, TBT, and total transfer size for `/`, `/docs/vision`, and `/registry` in both desktop and mobile presets.

## Findings & Recommendations

### Finding 1 — Vision page is **not** the perf outlier

The earlier hypothesis was that [site/content/docs/vision/index.mdx](../site/content/docs/vision/index.mdx) (430 lines, 37.7 KB of MDX, 10 numbered `##` sections) might be driving slow loads worth splitting into sibling pages. The bundle data does not support this:

- `/docs/[[...slug]]` covers `/docs/vision` and the four other doc routes at **148 kB First Load JS / 5.89 kB route-specific**. That is normal for a Fumadocs site and well within typical static-docs perf budgets.
- The 22–45s page compile times observed earlier came from `next dev` *without* `--turbopack` (since [.claude/launch.json](../.claude/launch.json) bypassed the `pnpm dev` script). That is a dev-mode artifact, not a user-visible cost. The turbopack flag (now fixed in this PR) eliminates it.

> **Note** — chunk filenames in `.next/static/chunks/` are content-hash-derived (e.g. `331-*.js`, `51-*.js`) and change every build. The breakdown above identifies chunks by their dominant module content, not by name.

**Recommendation:** Do **not** open a `feat/split-vision-page` PR on perf grounds. If the vision page is split later it should be for navigation/deep-linking reasons (one URL per ODS-RFC section), not for First Load JS. The 10 `## N.` sections map 1:1 to filenames if/when that happens, and `site/content/docs/vision/meta.json` is already in place to wire them.

### Finding 2 — `@openedx/paragon` (+ headlessui transitive) drives the `/registry` route

The `/registry` index is the only real outlier in this build: **304 kB First Load JS, 170 kB route-specific**. The Paragon registry chunk (146 kB gzipped) is dominated by `@openedx/paragon` (235 KB parsed) and its `@headlessui/react` peer (142 KB parsed), and is loaded eagerly for the `/registry` page because the gallery and Paragon-preview components import Paragon at module top level.

Two clues that the same chunk is **not** affecting other routes:
- `/registry/[...slug]` (the 62 per-component detail pages) is only **103 kB FLJS** — Paragon is not pulled into the per-component bundle.
- `/docs/*` and `/` are also at the 103–148 kB FLJS baseline.

So the cost is localized to one page. The leverage move is to dynamic-import the gallery from the registry index page so Paragon is fetched only after first paint, not in the critical bundle.

**Recommendation (out of scope for this PR):** Open `feat/registry-gallery-dynamic-import` to wrap [site/app/registry/page.tsx](../site/app/registry/page.tsx)'s gallery and `paragon-previews` imports in `next/dynamic({ ssr: false })`. Target: bring `/registry` First Load JS from 304 kB down toward the 103 kB baseline.

### Finding 3 — `@sdaitzman/prototype-devbar` is in the production bundle

The devbar + base-ui chunk is dominated by `@sdaitzman/prototype-devbar@1.2.0` at 147 KB parsed. The devbar is gated at runtime via `PROTOTYPE_DEVBAR_ENABLED`, but if it's loaded at module top level its code is still shipped to production regardless of the runtime flag. The `predev`/`prebuild` scripts in [site/package.json](../site/package.json) write `prototype-devbar.snapshot.json` for both dev and build, suggesting the bundle assumes the devbar is on.

**Recommendation (out of scope for this PR):** Open `chore/devbar-dynamic-import` to confirm the devbar is tree-shaken when `PROTOTYPE_DEVBAR_ENABLED !== 'true'`, or to wrap it in `next/dynamic` so the 147 KB is not shipped in production. The 65 KB `@base-ui/react` co-tenant of that chunk benefits from the same change.

### Finding 4 — `optimizePackageImports` is missing the heaviest deps

Current `experimental.optimizePackageImports` in [site/next.config.mjs](../site/next.config.mjs) covers `fumadocs-ui`, `fumadocs-core`, `lucide-react`, `@headlessui/react`, `react-intl`. It does **not** cover `@openedx/paragon` or `@base-ui/react`, which together account for ~300 KB parsed across the two heaviest non-framework chunks. Adding them is low-risk and complements the dynamic-import work above.

**Recommendation (small follow-up):** Add `@openedx/paragon`, `@base-ui/react`, and `@sdaitzman/prototype-devbar` to `optimizePackageImports`. Measure delta on the next build.

## Highest-Leverage Follow-ups (ranked)

1. **`feat/registry-gallery-dynamic-import`** — dynamic-import the gallery and Paragon previews on `/registry`. Largest expected delta: ~200 kB off the registry route's FLJS.
2. **`chore/devbar-dynamic-import`** — confirm/enforce that the prototype devbar is not in the production bundle. ~50–80 kB gzipped potential.
3. **`chore/extend-optimize-package-imports`** — add Paragon, base-ui, devbar. Small but free.

Splitting the vision page is **not** on this list — the data does not support it as a perf intervention.

## How to Reproduce

```bash
pnpm install
pnpm --filter @openedx-design-system/site run analyze
open site/.next/analyze/client.html
```

The analyzer build is gated behind `ANALYZE=true`; the regular `pnpm build` and CI `build` step are unchanged in cost.
