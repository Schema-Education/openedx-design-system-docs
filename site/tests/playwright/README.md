# Playwright regression suite — `/registry`

This suite is the safety net for the bugs we've burned cycles on in the
last few days — all of them surfaced only when a specific preview card
was rendered or clicked:

- `/[object Object]` 404 from `AvatarButton` (#72)
- Form auto-ID hydration mismatch (#80 + #75)
- `Fade` `offsetHeight` TypeError (#78)
- `Collapsible` `offsetHeight` TypeError (in-flight; not blocked on)

The goal is to walk every Paragon-backed preview card on the `/registry`
page, interact with it, and capture problems at four levels (page
errors, console errors, same-origin network errors, and timing).

## How to run

From `site/`:

```bash
pnpm test:e2e            # all specs
pnpm test:e2e --headed   # watch it run in a real window
pnpm test:e2e -g "Avatar"  # filter by test title substring
```

The Playwright config auto-spawns `pnpm dev` on port 3000. If you
already have the dev server running, it'll reuse the existing one (only
when not running under `CI`).

To run against a production build (sharper FCP numbers in the perf
spec):

```bash
pnpm build && pnpm start &   # in another terminal
PLAYWRIGHT_BASE_URL=http://localhost:3000 PLAYWRIGHT_PROD=1 pnpm test:e2e
```

First-time setup needs the Chromium browser:

```bash
pnpm exec playwright install chromium
```

## How it discovers the component list

The card-walk spec doesn't hardcode the list of components to test.
Instead it intersects two sources of truth:

1. **`site/lib/components.json`** — the registry metadata the gallery
   reads. Defines `name`, `slug`, `atomicLevel`, `sourceMfe`, etc. We
   filter to `sourceMfe === 'paragon'` since only Paragon-backed cards
   render a live subtree (other MFE entries fall back to the gradient
   placeholder).
2. **`site/components/previews/*.tsx`** — the per-bucket `_PREVIEWS`
   exports that the card uses to look up a render function. We parse
   the top-level keys of each `Record<string, () => ReactNode>` export.

A component is included in the suite iff it appears in both. New
previews land in the suite automatically.

See `helpers/components.ts` for the parser.

## Aggregate JSON report

After every test finishes, the suite flushes a per-card pass/fail
matrix to:

```
site/test-results/registry-coverage.json
```

Shape:

```jsonc
{
  "generatedAt": "2026-05-21T...",
  "totalCards": 60,
  "passed": 55,
  "failed": 5,
  "cards": [
    {
      "name": "AvatarButton",
      "slug": "avatar-button",
      "atomicLevel": "atom",
      "passed": false,
      "failureReasons": ["console.error x1", "networkError x1"],
      "consoleErrors": ["...React error #418..."],
      "pageErrors": [],
      "networkErrors": [{ "status": 404, "url": ".../[object Object]", "resourceType": "fetch" }],
      "clickToDetailMs": 312
    }
  ]
}
```

Reviewer workflow:

```bash
jq '.cards[] | select(.passed == false) | { name, failureReasons }' \
  site/test-results/registry-coverage.json
```

## Known-failing cards at time of writing

At the time this suite landed, every card passes — the recent fixes
(#72, #75, #78, #80, #88) all merged before the suite came online. The
table below is the historical bug-to-test mapping so a reviewer running
the suite can reason about which assertion catches which class of
regression.

| Card                 | Bug                                    | Fix       |
| -------------------- | -------------------------------------- | --------- |
| `AvatarButton`       | `/[object Object]` 404                 | #72       |
| `Form` / `FormGroup` | Auto-ID hydration mismatch             | #75, #80  |
| `Fade`               | `offsetHeight` TypeError               | #78       |
| `Collapsible`        | `offsetHeight` TypeError (React 19)    | #88       |

If you see a regression on any card here in a future run, treat it as
that bug rediscovered until proven otherwise.

## Specs

| File                            | What it covers                                                 |
| ------------------------------- | -------------------------------------------------------------- |
| `registry-cards.spec.ts`        | Per-card: scroll-into-view, click, assert detail pane, close.  |
| `registry-hydration.spec.ts`    | Cold-load /registry, scroll the whole grid, no errors anywhere. |
| `registry-perf.spec.ts`         | Loose FCP budget (dev: 500ms, prod: 200ms).                    |

## CI

This suite is CI-runnable in principle. The only manual setup beyond
`pnpm install` is `pnpm exec playwright install chromium` (≈170MB
download; cache via `~/.cache/ms-playwright/`). A future PR can wire
this in as a nightly job.

If a Playwright browser version mismatch becomes a problem under the
workspace's `minimumReleaseAge` floor, pin to a known-old version per
the pattern used for `@playwright/test` itself (see PR body).
