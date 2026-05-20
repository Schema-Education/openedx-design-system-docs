# ADR 0002 — Preview Strategy for MFE-Sourced Components

**Status:** Accepted

**Date:** 2026-05-20

## Context

The component registry seed (`site/lib/components.json`) catalogs 145 components: 96 from `@openedx/paragon` and 49 from Open edX Micro Front-Ends (`frontend-app-learning`, `frontend-app-authoring`, `frontend-base`, etc.). Paragon components are installable from npm and can be rendered as live previews directly in the gallery. MFE components are **not** distributed as npm packages — they live inside their respective MFE repositories and are not importable into the docs site.

Until the registry crawler pipeline (Phase 2a, see [vision/product-vision.mdx](../../vision/product-vision.mdx)) ingests MFE source code and the Sandpack live editor (Phase 2b, see [docs/adrs/0001-nextjs-app-router-fumadocs.md](./0001-nextjs-app-router-fumadocs.md)) renders sandboxed instances, we need an interim approach for the 49 MFE-sourced cards in the gallery.

Three options were considered:

1. **Keep the gradient-glyph fallback** — current behavior; gives no information about the component.
2. **Hand-curated Paragon-composed mocks** — visually faithful approximations built from Paragon primitives. High effort; risks drift from upstream source.
3. **Gradient-glyph fallback + "View source" link** — keep the visual placeholder, but add a GitHub deep-link in the card chrome so users can jump straight to the canonical implementation in the source MFE.

## Decision

Adopt **option 3**: keep the gradient-glyph thumbnail for MFE-sourced components, and add a "View source" link in `ComponentCard` that points to `https://github.com/{sourceRepo}/tree/main/{sourcePath}` (fields already captured in the registry schema, see [registry/schema/component.schema.json](../../registry/schema/component.schema.json)).

This decision is deliberately conservative. We do not commit to hand-curated mocks because:

- Mocks drift from the upstream component as MFE teams ship changes.
- The gradient-glyph is a clear signal that a card is a placeholder, which is more honest than a mock that *looks* live but is not.
- The crawler pipeline will replace the placeholder with real ingested previews in Phase 2a; mocks would be thrown away.

A small carve-out exists: if a specific MFE component becomes high-priority for outreach or marketing materials before Phase 2a ships, an individual hand-curated preview may be added under [site/components/previews/mfe.tsx](../../site/components/previews/mfe.tsx). Each such addition requires a comment citing the marketing/outreach trigger.

## Consequences

**Positive:**

- Zero ongoing maintenance burden — no mocks to keep in sync with upstream MFE source.
- Users always have a path to the real implementation (one click to GitHub).
- The gradient-glyph clearly signals "preview pending" rather than implying the rendered output is the component.

**Negative:**

- 49 of 145 cards (34%) show no visual preview until Phase 2a ships.
- Users browsing the gallery cannot see the visual identity of MFE components without leaving the site.

**Mitigations:**

- Phase 2a (registry crawler) is the long-term answer and is on the roadmap.
- Marquee MFE components may receive hand-curated previews on a case-by-case basis.

## Links

- [vision/product-vision.mdx](../../vision/product-vision.mdx) — Phase roadmap (Phase 2a, 2b).
- [docs/adrs/0001-nextjs-app-router-fumadocs.md](./0001-nextjs-app-router-fumadocs.md) — Sandpack/live-preview decision.
- [registry/schema/component.schema.json](../../registry/schema/component.schema.json) — `sourceRepo`, `sourcePath` fields.
