# Fixtures

This directory contains stand-in `paragon.registry.json` manifests for MFEs that have not yet adopted the registry format upstream.

## Purpose

The crawler supports two source types:

- `file://` — local fixtures (this directory)
- `https://` — live GitHub raw URLs once MFEs publish their own manifests

Fixtures are used during Phase 2a development and CI so that the ingestion pipeline can be exercised without depending on upstream repo changes.

## Files

| File | MFE | Notes |
|------|-----|-------|
| `frontend-app-learning.registry.json` | `openedx/frontend-app-learning` | 5-component pilot fixture. Covers courseware search and course tab navigation components. |

## Adding a new fixture

1. Copy an existing fixture as a template.
2. Set realistic `name`, `sourcePath`, `atomicLevel`, `status`, and `a11y` values.
3. Add a `file://` entry to `../config/sources.json`.
4. Run `pnpm --filter @openedx-design-system/crawler ingest:fixtures` to verify.

Once the upstream MFE publishes a real `paragon.registry.json`, replace the `file://` URL with the corresponding `https://raw.githubusercontent.com/...` URL and remove the fixture file.

## Related

- [`../config/sources.json`](../config/sources.json) — source list consumed by the crawler
- [`../../proposals/0001-mfe-component-registry.md`](../../proposals/0001-mfe-component-registry.md) — manifest spec
