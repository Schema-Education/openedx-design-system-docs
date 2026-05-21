---
number: 0001
title: Component Registry Manifest & MFE Atomic-Level Classification
status: draft
authors:
  - Marco Morales (Schema)
created: 2026-05-19
updated: 2026-05-19
category: proposal
relatedMFEs:
  - frontend-app-learning
  - frontend-app-learner-dashboard
  - frontend-app-authoring
  - frontend-app-instructor-dashboard
supersedes: null
supersededBy: null
---

# 0001 — Component Registry Manifest & MFE Atomic-Level Classification

## Summary

Adopt a per-repo `paragon.registry.json` manifest so each MFE can self-register its React components with atomic-design level classifications (atom, molecule, organism, template, page) and optional Figma Code Connect URLs. The manifest feeds a documentation auto-pipeline and creates the first machine-readable link between Figma files (produced in Phase 1) and source components across MFE repositories. Paragon's existing atoms/molecules are out of scope here; this RFC covers the layer above Paragon that only lives in MFE repos.

## Motivation

Phase 1 of the ODS collateral project produced per-MFE Figma files for `frontend-app-learning`, `frontend-app-learner-dashboard`, `frontend-app-authoring`, and `frontend-app-instructor-dashboard`. Those files are authoritative design artifacts, but there is no machine-readable connection between a Figma component and its React implementation. Locating a component today requires a developer to know which MFE contains it and where in the directory tree it lives — there is no index.

Paragon (`openedx/paragon`) addresses this gap for shared atoms and molecules, but organisms, templates, and page-level compositions are MFE-specific and have no comparable registry. As a result, the documentation pipeline, the Figma ↔ code sync tooling, and any future AI-assisted component search are all blocked on manual curation.

This RFC proposes a lightweight, lintable manifest format that resolves these gaps without requiring MFE teams to restructure their directories or adopt new runtime tooling.

## Stakeholders

| Group | Role | Notes |
|---|---|---|
| Axim Collaborative | **primary** | Schema governance and funding authority; manifest format becomes a community standard |
| MFE maintainers | consulted | Own implementation of `paragon.registry.json` per repo; must agree the format is low-friction |
| Paragon maintainers | consulted | Registry schema must not conflict with Paragon's own component catalog |
| Schema | consulted | Owns documentation pipeline consuming the manifests |
| Designers | informed | Figma Code Connect URLs in the manifest close the Figma ↔ code gap |
| Open edX providers | informed | Downstream forks must also adopt manifests or opt out explicitly |
| PMs | informed | Phase gating depends on roadmap alignment |

## Proposal

Each MFE repo adds a `paragon.registry.json` file at the repo root. The file is a JSON array of component descriptors conforming to `registry/schema/component.schema.json` (maintained in the ODS mono-repo).

### Schema

Each component entry has the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | PascalCase component name matching the export identifier |
| `atomicLevel` | enum | yes | `atom` \| `molecule` \| `organism` \| `template` \| `page` |
| `status` | enum | yes | `stable` \| `experimental` \| `deprecated` |
| `sourceMfe` | string | yes | MFE slug, e.g. `frontend-app-learner-dashboard` |
| `sourceRepo` | string | yes | Full GitHub repo path, e.g. `openedx/frontend-app-learner-dashboard` |
| `sourcePath` | string | yes | Repo-relative path to the component's entry file |
| `version` | string | yes | Semver string matching the MFE package version at time of registration |
| `figmaCodeConnectUrl` | string \| null | no | Figma Code Connect URL if the component has a connected Figma node |
| `consumers` | string[] | no | MFE slugs that import this component; populated by static analysis |
| `a11y` | enum | no | `A` \| `AA` \| `AAA` \| `unknown` — WCAG 2.1 conformance rating |
| `lastIngested` | string | yes | ISO 8601 timestamp of the last successful ingestion by the doc pipeline |

### Example — `CourseCard`

```json
[
  {
    "name": "CourseCard",
    "atomicLevel": "molecule",
    "status": "stable",
    "sourceMfe": "frontend-app-learner-dashboard",
    "sourceRepo": "openedx/frontend-app-learner-dashboard",
    "sourcePath": "src/containers/CourseCard/index.jsx",
    "version": "2.6.0",
    "figmaCodeConnectUrl": "https://www.figma.com/design/XXXXXXXX/Learner-Dashboard?node-id=1234-5678",
    "consumers": [
      "frontend-app-learning",
      "frontend-app-instructor-dashboard"
    ],
    "a11y": "AA",
    "lastIngested": "2026-05-19T00:00:00Z"
  }
]
```

### Annotation Alternative (Future Enhancement)

An inline alternative considered during drafting was a JSDoc `@paragon-registry` annotation on each component export, with a crawler reading annotations at CI time rather than a separate JSON file. This is listed as a future enhancement (not the primary path) because a flat JSON file is easier to lint against the schema, easier to diff in pull requests, and does not require parsing JSX/TSX source. The JSDoc approach remains viable as an ergonomic layer on top of the JSON file in a later RFC.

### Tooling

- The ODS mono-repo will publish a `validate-registry` CLI that runs `ajv` against `registry/schema/component.schema.json`.
- Each MFE's CI pipeline adds a step: `npx @openedx/ods-registry validate` — fails on schema violations.
- The doc pipeline polls each MFE's default branch for `paragon.registry.json` on a nightly schedule and updates `lastIngested` on successful ingestion.

## Alternatives Considered

- **Storybook stories as the registry source of truth**: Each component's story exports metadata including atomicLevel. Rejected because Storybook is not installed in most Open edX MFEs; mandating it would impose a significant tooling dependency and couple component registration to a UI development tool that is orthogonal to documentation.
- **File-path conventions (e.g. `src/atoms/`, `src/molecules/`)**: The crawler infers atomicLevel from directory structure. Rejected because it would force a disruptive directory restructure in every MFE, breaking existing import paths and introducing churn with no benefit to runtime behavior. MFE teams should not pay a migration cost for a documentation concern.

## Risks & Mitigations

- **Risk**: `paragon.registry.json` drifts from the actual component tree as components are added, moved, or deleted. **Mitigation**: JSON Schema validation runs in each MFE's CI pipeline; PRs that delete a registered component's `sourcePath` without updating the manifest fail CI automatically.
- **Risk**: Teams disagree on what atomicLevel a component belongs to, leading to inconsistent classification across MFEs. **Mitigation**: `docs/atomic-design-taxonomy.md` in the ODS mono-repo is the canonical tie-breaker. The taxonomy document provides worked examples for each level drawn from the actual MFE components. Disputed classifications are resolved by the Axim design systems working group, not per-MFE maintainers unilaterally.
- **Risk**: Mobile apps (iOS/Android) do not fit the React component model and cannot produce a `paragon.registry.json`. **Mitigation**: Mobile is explicitly deferred to a subsequent ODS-RFC. The schema's `sourceMfe` and `sourceRepo` are decoupled — a future revision can introduce non-MFE source types (e.g. `mobile-android`, `mobile-ios`, or `edx-platform` for legacy Django pages) without breaking the schema.

## Open Questions

- **Q1: Who owns the registry schema version?** The ODS mono-repo is the natural home, but schema breaking changes require a coordinated bump across all MFEs simultaneously. Should the schema use a version field and support multiple versions in the pipeline simultaneously?
- **Q2: What happens when a component's `atomicLevel` reclassifies?** For example, `CourseCard` is registered as a molecule but is later refactored into an organism. Does the pipeline treat this as a new component (breaking consumers' documentation links) or a rename?
- **Q3: Should `consumers` be bidirectionally maintained?** Currently, `consumers` is populated by static analysis in the pipeline rather than by the registering MFE. This creates a race condition where a consumer MFE doesn't appear in the list until the pipeline next runs. Is a manual override field (`consumerOverrides`) worth adding?

## Roadmap & Rollout

| Phase | Scope | Success Metric | Exit Criteria |
|---|---|---|---|
| 2a | Pilot: `frontend-app-learning` — 5–10 representative components registered | Manifest validates against schema in CI; doc pipeline ingests at least one entry | CI step green on `frontend-app-learning`; one component appears in the auto-doc preview |
| 2b | Extend to `frontend-app-authoring` and `frontend-app-learner-dashboard` | 80%+ of non-Paragon UI components registered across the two MFEs | Both repos pass `validate-registry` in CI; `lastIngested` timestamps within 24h |
| 2c | Full coverage + Figma Code Connect | All four pilot MFEs registered; `figmaCodeConnectUrl` populated for stable components | Figma Code Connect round-trip verified for at least 5 components; `frontend-app-instructor-dashboard` added |

## References

- [Open edX Design System Vision](../vision/product-vision.mdx)
- [Atomic Design Taxonomy](../docs/atomic-design-taxonomy.md)
- [Component Registry JSON Schema](../registry/schema/component.schema.json)
- [ShadCN `components.json` — prior art for single-repo component manifests](https://ui.shadcn.com/docs/components-json)
- [Figma Code Connect documentation](https://www.figma.com/developers/code-connect)
