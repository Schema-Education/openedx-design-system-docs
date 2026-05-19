# Component Registry

## Purpose

The registry is the authoritative manifest of Open edX design system components. It defines a standard schema (`schema/component.schema.json`) for component metadata and will host a future crawler pipeline that ingests `paragon.registry.json` declarations from Micro Front-End repositories and generates corresponding documentation pages in the main docs site.

## Current State

**Phase 1 (Complete):** Schema definition. The JSON Schema is defined and ready for adoption by MFE repositories.

**Phase 2a (Complete):** Crawler MVP using local fixtures — see `crawler/` directory.

**Phase 2b (In Progress):** Connect crawler to real `paragon.registry.json` files published by MFE repos.

## How It Works

The registry pipeline flows through five steps:

1. **Declare:** Each MFE repository declares its components in a `paragon.registry.json` file at the root, following the schema defined in `schema/component.schema.json`.

2. **Crawl:** An automated crawler (Phase 2a) discovers `paragon.registry.json` files across the Open edX organization repositories.

3. **Generate:** The crawler validates each entry against the schema, then generates a corresponding MDX file for each component in `/site/content/registry/{atomicLevel}/{name}.mdx`.

4. **Link Figma:** Code Connect mappings (if present) automatically link Figma designs to their code implementations in the generated documentation.

5. **Build:** The Next.js site builds the registry pages alongside the main docs, making them searchable and linkable.

## Schema Reference

See `schema/component.schema.json` for the full JSON Schema definition. Key fields:

- `name` (PascalCase)
- `atomicLevel` (atom | molecule | organism | template | page)
- `status` (stable | experimental | deprecated)
- `sourceMfe`, `sourceRepo`, `sourcePath` (location information)
- `version` (semver)
- `figmaCodeConnectUrl` (optional; Figma design link)
- `consumers` (array of repos that depend on this component)
- `a11y` (A | AA | AAA | unknown)
- `lastIngested` (ISO 8601 timestamp)

## Example Component Declaration

In a Micro Front-End repository, you would declare components in `paragon.registry.json`:

The file is a top-level JSON array; each entry conforms to `schema/component.schema.json`:

```json
[
  {
    "name": "CourseCard",
    "atomicLevel": "molecule",
    "status": "stable",
    "sourceMfe": "frontend-app-learner-dashboard",
    "sourceRepo": "openedx/frontend-app-learner-dashboard",
    "sourcePath": "src/containers/CourseCard/index.jsx",
    "version": "1.2.0",
    "figmaCodeConnectUrl": null,
    "consumers": ["frontend-app-learning"],
    "a11y": "AA",
    "lastIngested": "2026-05-19T14:30:00Z"
  }
]
```

## Running the Crawler

- `pnpm crawler:typecheck` — type-check
- `pnpm crawler:test` — run tests
- `pnpm crawler:ingest` — ingest fixtures and generate MDX in `/site/content/registry/`

For detailed usage and contributing to the crawler, see `./crawler/README.md`.

## Related Proposals

See [ODS-0001 — MFE Component Registry](../proposals/0001-mfe-component-registry.md) for the RFC that introduced the registry architecture.

## Questions?

- Review the schema definition: `schema/component.schema.json`
- Check the [Atomic Design Taxonomy](../docs/atomic-design-taxonomy.md) for component level definitions
- See the [Contributing Guide](../docs/contributing.md) for how to register your components
