# Open edX Design System Documentation — Claude Conventions

## Repository Purpose

This repository is the canonical hub for Open edX design system governance, spanning component metadata, architectural decisions, and collaborative evolution across all Open edX Micro Front-Ends and the edx-platform. Led by Schema Education and aligned with Axim's stewardship, it replaces the Paragon-only Netlify site with a unified documentation experience that reflects the entire ecosystem—atoms through pages, Paragon through custom MFE components.

## Where Things Live

Mirror the README.md structure:

- **`/vision/product-vision.mdx`** — Strategic direction, governance model, Phase roadmap. Preserve the 10-section structure when updating.
- **`/proposals/`** — Open edX Design System RFC-style proposals (ODS-RFCs). Copy `TEMPLATE.md` for new proposals; name files as `NNNN-kebab-description.md`.
- **`/docs/`** — Reference docs: atomic-design-taxonomy.md, contributing.md, style-guide.md, adrs/ (ADRs).
- **`/site/`** — Next.js documentation site (Fumadocs + Tailwind). Output lives here; built via `pnpm dev` or `pnpm build`.
- **`/registry/`** — Component metadata schema (`schema/component.schema.json`) and future crawler pipeline.

## Branching Conventions

Follow the global CLAUDE.md branching rules:

- **`feat/`** — New content (new proposals, new docs sections, new registry entries, new vision subsections).
- **`fix/`** — Corrections (factual errors, stale data, broken links, typos).
- **`chore/`** — Non-content maintenance (CLAUDE.md updates, CI workflow fixes, .gitignore, symlinks).
- **`initiative/`** — Long-running collection branches (e.g., `initiative/registry-phase-2a-q2-2026`); use when multiple related PRs must ship together.
- **`local/`** — Personal scratch work not intended for merge.

Naming convention: `prefix/short-kebab-description` (3–5 words).

## Session Startup Gate (Mandatory)

Before creating any branch or beginning content work in a new session:

1. **Fetch latest remote state:**
   ```bash
   git fetch --all --prune
   ```

2. **List remote initiative branches:**
   ```bash
   git branch -r | grep initiative/
   ```

3. **Check for open or draft PRs from initiative branches targeting `main`:**
   ```bash
   gh pr list --state open --base main --json headRefName,title,isDraft,url \
     | jq '.[] | select(.headRefName | startswith("initiative/"))'
   ```

4. **Present findings and confirm the base branch with the user before proceeding.**
   - List any `initiative/` branches that exist on the remote.
   - List any of those with an open or draft PR targeting `main` (include title and URL).
   - Ask: "Should this work be based off one of these initiative branches, or off `main` directly?"
   - Do not create any branch or begin any work until the user answers.
   - If no initiative branches exist and no matching PRs are found, proceed off `main` without asking.

## Component Registry MDX Generation

When generating new component registry MDX files in `/site/content/registry/{atomicLevel}/{name}.mdx`, follow the schema defined in `/registry/schema/component.schema.json`. Each file must include:

- `name` (PascalCase)
- `atomicLevel` (atom, molecule, organism, template, page)
- `status` (stable, experimental, deprecated)
- `sourceMfe` (repo slug without org prefix, e.g., "frontend-app-learning")
- `sourceRepo` (full GitHub slug, e.g., "openedx/frontend-app-learning")
- `sourcePath` (path within the source repo)
- `version` (semver)
- `figmaCodeConnectUrl` (optional; URI-reference format)
- `consumers` (array of repo slugs that depend on this component)
- `a11y` (A, AA, AAA, or unknown)
- `lastIngested` (ISO 8601 date-time)

See `/registry/schema/component.schema.json` for the canonical JSON Schema definition.

## Vision Document Updates

When editing `/vision/product-vision.mdx`, preserve the 10-section structure:

1. Executive Summary
2. Governance Model
3. Atomic Design Taxonomy
4. Component Lifecycle
5. Figma-to-Code Alignment
6. MFE Integration Strategy
7. Phase Roadmap
8. Success Metrics
9. Risk and Mitigation
10. Appendix (Glossary, References)

Update section content as needed, but do not rename or reorder sections without opening an ODS-RFC first.

## Proposal Guidelines

New proposals must:

1. Copy `/proposals/TEMPLATE.md` to `/proposals/NNNN-kebab-description.md` (increment the sequence number).
2. Follow ODS-RFC format (Status, Date, Problem Statement, Proposed Solution, Alternatives, Consequences, Links).
3. Open a PR with base branch set to `main` (or an active `initiative/` branch if coordinated).
4. Link to related ADRs or vision sections.

The proposals directory serves as the RFC-style decision log for the design system.

## Pull Request Conventions

Before opening any PR:

1. **Rename the branch** if it doesn't follow `prefix/short-kebab-description`.
2. **Sync against the latest target branch:**
   ```bash
   git fetch origin
   git rebase origin/<target-branch>
   ```
3. **Include Notion section in PR body** (if working in a Schema project context):
   ```markdown
   ## Notion
   [Project Name](https://notion.so/...)
   Task: [Task or sub-project name](https://notion.so/...) <!-- if applicable -->
   ```
   If no linked project, use `No specific project`.

## Code of Conduct

All contributors are expected to follow the [Open edX Code of Conduct](https://openedx.org/community/community-guidelines).
