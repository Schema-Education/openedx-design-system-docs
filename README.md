# Open edX Design System Documentation

A unified design system documentation repository spanning atoms through pages across Open edX Micro Front-Ends (MFEs). This replaces the Paragon-only Netlify site and serves as the canonical source for Open edX component governance, proposals, and vision.

Led by Schema Education and aligned with Axim's Open edX stewardship, this repository collects component metadata, architectural decisions, and design system evolution across the entire Open edX ecosystem.

## Repository Map

- **/site/content/docs/vision/** — Product vision and strategic direction (rendered at `/docs/vision`)
- **/site/content/docs/proposals/** — Open edX Design System RFC-style proposals (ODS-RFCs); new proposals copy `TEMPLATE.mdx`
- **/docs/** — Reference documentation: atomic design taxonomy, contributor guide, style guide, and ADRs
- **/site/** — Next.js documentation site (built on Fumadocs + Tailwind); source for published docs.openedx.org
- **/registry/** — Component registry schema and future metadata crawler (Phase 2a work)

## Key Links

- [Product Vision](./site/content/docs/vision/index.mdx) — Strategic direction and Phase roadmap
- [Proposals Index](./site/content/docs/proposals/index.mdx) — Open RFCs and design decisions
- [Atomic Design Taxonomy](./docs/atomic-design-taxonomy.md) — Level definitions with Open edX examples
- [Contributing Guide](./docs/contributing.md) — How to propose changes and register components
- [Repository Conventions](./CLAUDE.md) — Branching, session startup, and content standards

## Status

**Pre-alpha** — Phase 2 of the Open edX collateral project. Vision and initial documentation published; component registry schema defined; crawler and MFE ingestion pipeline in development (Phase 2a).

## License

Apache-2.0 (pending confirmation)
