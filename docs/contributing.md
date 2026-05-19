# Contributing Guide

Welcome to the Open edX Design System Documentation project. This guide covers how to propose changes, register components, and work within our branching and PR conventions.

## How to Propose a Change

### Using the Proposal (RFC) Process

For significant changes to the design system—new patterns, governance shifts, or breaking changes—use the proposal (RFC) process:

1. Review existing proposals in `/proposals/` to check if your idea has been discussed.
2. Copy `/proposals/TEMPLATE.md` to a new file: `/proposals/NNNN-kebab-description.md` (increment the sequence number).
3. Fill in the proposal template following ODS-RFC (Open edX Design System RFC) conventions:
   - **Status:** Draft
   - **Date:** Today's date (YYYY-MM-DD)
   - **Problem Statement:** What problem does this solve?
   - **Proposed Solution:** How do we solve it?
   - **Alternatives:** What other approaches were considered?
   - **Consequences:** What are the impacts (positive and negative)?
   - **Links:** Related ADRs, vision sections, or GitHub issues
4. Open a pull request with your proposal. Use a `feat/` or `initiative/` branch (see below).
5. Discuss in the PR; revise as needed. When consensus is reached, set Status to "Accepted" and merge.

### For Documentation Changes

For corrections, clarifications, and non-breaking documentation updates:

1. Create a branch using the naming convention below.
2. Edit the relevant `.md` file in `/docs/` or update `/vision/product-vision.mdx` while preserving the 10-section structure.
3. Open a PR with a clear description of the change.
4. Link to related proposals or ADRs if applicable.

## How to Register a New Component

Components are registered via a `paragon.registry.json` file in each MFE repository. When you add or significantly change a component:

1. In your MFE repo, create or update `paragon.registry.json` at the root with entries for your component.
2. Follow the schema defined in `/registry/schema/component.schema.json`.
3. Include all required fields:
   - `name` (PascalCase)
   - `atomicLevel` (atom, molecule, organism, template, or page)
   - `status` (stable, experimental, or deprecated)
   - `sourceMfe` (repo slug without org, e.g., "frontend-app-learning")
   - `sourceRepo` (full GitHub slug, e.g., "openedx/frontend-app-learning")
   - `sourcePath` (path within the repo)
   - `version` (semver)
   - `figmaCodeConnectUrl` (optional; URI-reference)
   - `consumers` (array of repo slugs that depend on this component)
   - `a11y` (A, AA, AAA, or unknown)
   - `lastIngested` (ISO 8601 date-time)
4. Open a PR in your MFE. Once merged, the registry crawler (Phase 2a) will automatically ingest your component and generate documentation in this repo.

See `/registry/schema/component.schema.json` for the full JSON Schema definition.

## Branching Conventions

All branches follow these prefixes (see CLAUDE.md for full details):

- **`feat/`** — New content (new proposals, new docs sections, new component registrations).
  - Example: `feat/add-course-card-molecule-docs`
- **`fix/`** — Corrections (typos, stale data, broken links, factual errors).
  - Example: `fix/paragon-button-path-typo`
- **`chore/`** — Non-content maintenance (CLAUDE.md updates, CI changes, .gitignore).
  - Example: `chore/update-ci-workflow`
- **`initiative/`** — Long-running collection branches for multi-PR work that must ship together.
  - Example: `initiative/registry-phase-2a-q2-2026`
- **`local/`** — Personal scratch work not intended for merge.

**Naming convention:** `prefix/short-kebab-description` (3–5 words).

## PR Conventions

Before opening any pull request:

1. **Rename your branch** if it doesn't follow `prefix/short-kebab-description`.
2. **Sync against the latest target branch:**
   ```bash
   git fetch origin
   git rebase origin/<target-branch>
   ```
3. **Include the Notion section** in your PR body if you're working in a Schema Education context:
   ```markdown
   ## Notion
   [Project Name](https://notion.so/...)
   Task: [Task or sub-project name](https://notion.so/...) <!-- if applicable -->
   ```
   If no linked Notion project, use `No specific project`.

4. **Write a clear description:** Summarize what changed and why. Link to related issues, proposals, or ADRs.
5. **Ensure your branch is up to date:** Rebase on the target branch before requesting review.

## Code of Conduct

All contributors are expected to follow the [Open edX Code of Conduct](https://openedx.org/community/community-guidelines). We are committed to providing a welcoming and inclusive environment for all participants.

## Questions?

- Check existing proposals in `/proposals/` or ADRs in `/docs/adrs/`.
- Review the [Product Vision](../vision/product-vision.mdx) for strategic context.
- Open a GitHub discussion or issue with your question.
