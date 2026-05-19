# ADR 0001 — Next.js App Router + Fumadocs for the Docs Site

**Status:** Accepted

**Date:** 2026-05-19

## Context

The original Paragon documentation site is hosted on Gatsby and Netlify. As the Open edX design system expands to span multiple Micro Front-Ends and includes component metadata, proposals, and vision documents, we need a documentation platform that can:

1. Aggregate component definitions from multiple MFE repositories (via `paragon.registry.json` files).
2. Render Markdown and MDX content for proposals, vision docs, and guides.
3. Support static export (no server required; compatible with CDNs and static hosts).
4. Provide full-text search across documentation.
5. Enable live preview of React components (future requirement; Phase 2b).

The current Gatsby site does not easily support dynamic content collection from multiple upstream repos, and its maintenance burden is high. We need a modern alternative.

## Decision

We will build the documentation site using:

- **Next.js 14+ with App Router** — Modern React framework with strong RSC support, excellent TypeScript support, and flexible deployment options.
- **Fumadocs** — An MDX-first content framework built on Next.js that provides file-based routing, automatic navigation, and search indexing.
- **Tailwind CSS** — Styling engine with Paragon design tokens applied as a preset (future: Paragon token package).
- **Pagefind** — Static search engine that generates a search index at build time; no backend required.
- **Static Export** (`output: 'export'` in `next.config.mjs`) — Build generates an `out/` directory of static HTML; deployable anywhere (Vercel, Netlify, S3, etc.).
- **Sandpack** (deferred to Phase 2b) — For interactive component previews; requires React execution in the browser.

The site will live in `/site/` as a separate pnpm workspace package (`@openedx-design-system/site`) and consume component metadata from `/registry/` and documentation from `/docs/`, `/vision/`, and `/proposals/`.

## Consequences

### Positive

- **Modern stack:** App Router with React Server Components (RSC) provides cleaner separation of concerns and better performance defaults.
- **Static export:** No server required; trivial to deploy to any CDN or static host.
- **MDX-native:** Fumadocs is purpose-built for MDX, with first-class support for frontmatter, collections, and sidebar generation.
- **Search out of the box:** Pagefind generates a performant, client-side search index; no API needed.
- **Easy Vercel/Netlify integration:** Both platforms have excellent Next.js support with one-click deployments.
- **Component preview-ready:** Sandpack integration is straightforward for Phase 2b.

### Negative

- **Fumadocs ecosystem is newer:** Unlike Gatsby, Fumadocs has a smaller community and fewer third-party plugins. We may encounter edge cases or need to write custom solutions.
- **App Router learning curve:** For contributors unfamiliar with App Router conventions, there is a small onboarding cost.
- **Lock-in to Next.js conventions:** App Router conventions are strongly opinionated; migrating away later would be costly.
- **Build performance at scale:** If the site grows significantly (1000+ pages), build times may become noticeable; we will monitor and optimize as needed.

## Alternatives Considered

### Gatsby + Plugins

**Pros:** Mature, large ecosystem, established Paragon integration.

**Cons:** Maintenance burden; GraphQL-based data layer is verbose for simple file-based content; plugin ecosystem fragmentation; slower build times for large sites.

**Decision:** Rejected. The current Paragon Gatsby site shows declining maintenance; we want to move toward a simpler, more maintainable approach.

### Nextra v3

**Pros:** Similar to Fumadocs; built on Next.js; strong TypeScript support.

**Cons:** Less actively developed than Fumadocs; smaller community; fewer customization examples.

**Decision:** Rejected. Fumadocs has stronger momentum and better integration with Tailwind and Paragon.

### Astro

**Pros:** Excellent for static sites; island architecture; zero-JS by default; fast builds.

**Cons:** Weaker React component preview story; requires workarounds for interactive component libraries; less mature ecosystem for design system docs.

**Decision:** Rejected. The design system needs to showcase interactive React components; Astro's island model makes this difficult.

## Links

- [Product Vision](../../vision/product-vision.mdx) — Strategic direction and Phase roadmap
- [Site Configuration](../../site/next.config.mjs) — Next.js and Fumadocs config
- [Registry Schema](../../registry/schema/component.schema.json) — Component metadata structure
- [Repository Map](../../README.md) — Project structure overview
