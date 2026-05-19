# ODS-RFCs — Open edX Design System Proposals

ODS-RFCs (Open edX Design System Request for Comments) propose product, feature, UX, and development changes to the design system and MFE component model. They are the primary record of significant decisions: what was considered, what was chosen, and why.

## Lifecycle

```
draft → review → accepted
                └→ rejected

accepted → superseded (by a later RFC)
```

| Status | Meaning |
|---|---|
| `draft` | Work in progress; not ready for broad review |
| `review` | Circulated for stakeholder feedback; open questions being resolved |
| `accepted` | Approved and either complete or in active implementation |
| `rejected` | Evaluated and declined; rationale preserved for future reference |
| `superseded` | Replaced by a newer RFC (see `supersededBy` frontmatter) |

An RFC in `review` must resolve all **Open Questions** before advancing to `accepted`.

## Proposals

| Number | Title | Status | Category | Updated |
|---|---|---|---|---|
| [0001](./0001-mfe-component-registry.md) | Component Registry Manifest & MFE Atomic-Level Classification | draft | proposal | 2026-05-19 |

## Adding a New Proposal

1. Copy [`TEMPLATE.md`](./TEMPLATE.md) to a new file: `NNNN-kebab-title.md`, using the next available four-digit number.
2. Fill in all frontmatter fields. Set `status: draft`.
3. Complete every section. Sections may be brief, but none should be omitted — use "N/A — rationale" rather than deleting a section.
4. Add a row to the table above in this README (keep rows sorted by number).
5. Open a pull request. The RFC does not need to be complete to open a PR; draft PRs are welcome for early feedback.

RFCs that touch MFE repos should list those repos in the `relatedMFEs` frontmatter field using their GitHub slug (e.g. `frontend-app-learning`).
