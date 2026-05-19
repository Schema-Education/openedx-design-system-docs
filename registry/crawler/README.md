# @openedx-design-system/crawler

CLI package that ingests `paragon.registry.json` manifests from Open edX MFEs, validates them against the component schema, and generates MDX documentation pages for the design system site.

## What it does

1. **Loads sources** from `config/sources.json` (local fixtures or GitHub raw URLs)
2. **Validates** each manifest entry against `registry/schema/component.schema.json`
3. **Emits MDX** into `site/content/registry/{atomicLevel}/{component-name}.mdx`

The generated MDX files are consumed by Fumadocs and become the component reference pages in the design system docs site.

## Running

```bash
# From the repo root — ingest all configured fixture sources:
pnpm --filter @openedx-design-system/crawler ingest:fixtures

# Or from this package:
pnpm dev ingest --from-fixtures
```

## Commands

| Command | Description |
|---------|-------------|
| `ods-crawler validate <path>` | Validate a manifest JSON file. Exits 0 on pass, 1 on failure. |
| `ods-crawler ingest` | Fetch all configured sources and emit MDX. |
| `ods-crawler ingest --from-fixtures` | Only process sources with `ref: "fixture"`. |
| `ods-crawler ingest --output <dir>` | Override the MDX output directory. |
| `ods-crawler --help` | Show usage. |

## Adding a new MFE source

1. **If the MFE has a published manifest** (GitHub raw URL):
   Add an entry to `config/sources.json` with `"manifestUrl": "https://raw.githubusercontent.com/..."`.

2. **If the MFE doesn't have a manifest yet**:
   Create a fixture in `fixtures/<mfe-name>.registry.json` (copy an existing fixture as a template),
   then add a `file://./fixtures/<mfe-name>.registry.json` entry to `config/sources.json`.
   See [`fixtures/README.md`](fixtures/README.md) for details.

## Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Run tests
pnpm test

# Build compiled output
pnpm build
```

## Related

- [`../README.md`](../README.md) — registry workspace overview
- [`../../proposals/0001-mfe-component-registry.md`](../../proposals/0001-mfe-component-registry.md) — manifest spec and pipeline design
- [`../../registry/schema/component.schema.json`](../schema/component.schema.json) — JSON Schema for component entries
