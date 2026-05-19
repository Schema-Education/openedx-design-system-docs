---
number: 0000
title: Short imperative title
status: draft         # draft | review | accepted | rejected | superseded
authors:
  - Name (org)
created: YYYY-MM-DD
updated: YYYY-MM-DD
category: proposal    # proposal | feature-idea | fast-track-ux | fast-track-dev | platform-change
relatedMFEs: []       # repo slugs touched, e.g. frontend-app-learning
supersedes: null
supersededBy: null
---

# 0000 — Short Imperative Title

## Summary

Two to three sentences. State what changes, what it affects, and the core reason it's worth doing. Reviewers should be able to decide whether to read further from this section alone.

## Motivation

Describe the problem. Explain who experiences it, how often, and at what cost. Reference prior discussions, issues, or decisions that led here — but focus on what those conversations left unresolved or what has changed since. Avoid restating the proposal; keep this section diagnostic.

## Stakeholders

List every group that needs to be consulted, informed, or whose sign-off is required. Mark the **primary** stakeholder (the one whose approval is blocking).

| Group | Role | Notes |
|---|---|---|
| Axim Collaborative | primary | Governance and funding authority |
| MFE maintainers | consulted | Per-repo implementation owners |
| Paragon maintainers | consulted | Shared component library owners |
| Designers | informed | Figma file owners |
| PMs | informed | Roadmap and prioritization |
| Providers (list) | informed | OpenCraft, eduNEXT, Edly, Raccoon Gang, Appsembler, IBL — downstream consumers |
| Course authors | informed | End-users of components in authoring tools |

Remove rows that don't apply. Add any groups specific to this proposal.

## Proposal

The concrete change. Be specific: what gets created, modified, or removed, and by whom. Use sub-sections to separate distinct parts of the change. Include code or config examples in fenced blocks.

```json
// Example: show the exact shape of any new artifact introduced
{
  "example": true
}
```

### Sub-section (if needed)

Break large proposals into logical sub-sections rather than one dense wall of text.

## Alternatives Considered

Document at least two alternatives that were evaluated and rejected. This section signals to reviewers that the proposal space was explored and defends the chosen direction.

- **Alternative A — Description**: One-sentence rationale. Rejected because: explain why this was insufficient or impractical.
- **Alternative B — Description**: One-sentence rationale. Rejected because: explain why this was insufficient or impractical.

## Risks & Mitigations

- **Risk**: Describe the failure mode or downside. **Mitigation**: Describe the concrete step that reduces or eliminates it.
- **Risk**: ... **Mitigation**: ...

## Open Questions

Explicit unknowns that reviewers should weigh in on. Each item should be a discrete, answerable question — not a vague concern. Unresolved questions block status from advancing to `accepted`.

- Q1: ...
- Q2: ...

## Roadmap & Rollout

Break delivery into phases. Each phase should have a success metric and exit criteria so the team knows when to advance.

| Phase | Scope | Success Metric | Exit Criteria |
|---|---|---|---|
| 2a | Pilot in one MFE | X components registered | CI passes on pilot MFE |
| 2b | Expand to N MFEs | ... | ... |
| 2c | Full coverage | ... | ... |

## References

- [Open edX Design System Vision](../vision/product-vision.mdx)
- [Related ODS-RFC — title](./NNNN-related-rfc.md)
- [External prior art or upstream documentation](https://example.com)
