# Atomic Design Taxonomy

## Overview

Atomic design is a methodology for creating design systems at scale, developed by Brad Frost. It breaks down user interfaces into a hierarchy of increasingly complex functional units—atoms, molecules, organisms, templates, and pages—enabling systematic composition and reuse. This document defines the canonical taxonomy for the Open edX design system, with concrete examples drawn from across the Open edX ecosystem.

## Atomic Levels

### Atom

**Definition:** The smallest, indivisible unit of a user interface. Atoms are primitive components that cannot be broken down further without losing their meaning. They typically have no dependencies on other components and are often unstyled or minimally styled.

**Open edX Examples:**
- `Button` from [openedx/paragon](https://github.com/openedx/paragon) (src/Button/)
- `Icon` from [openedx/paragon](https://github.com/openedx/paragon) (src/Icon/)

### Molecule

**Definition:** A group of atoms bonded together in a relatively simple functional unit. Molecules have their own identity and can be tested as a unit, but do not own or fetch data. They typically compose atoms to form a simple, isolated interface piece.

**Open edX Examples:**
- `CourseCard` from [openedx/frontend-app-learner-dashboard](https://github.com/openedx/frontend-app-learner-dashboard) (src/containers/CourseCard/index.jsx)
- `CardHeader` from [openedx/frontend-app-authoring](https://github.com/openedx/frontend-app-authoring) (src/course-outline/card-header/CardHeader.tsx)

### Organism

**Definition:** A relatively complex UI component composed of groups of molecules and atoms. Organisms are clusters of molecules joined together to form a distinct section of an interface. Organisms are often feature-focused and may own or coordinate data fetching.

**Open edX Examples:**
- `CourseTabsNavigation` from [openedx/frontend-app-learning](https://github.com/openedx/frontend-app-learning) (src/course-tabs/CourseTabsNavigation.tsx)
- `LearnerDashboardHeader` from [openedx/frontend-app-learner-dashboard](https://github.com/openedx/frontend-app-learner-dashboard)
- `InstructorNav` from [openedx/frontend-app-instructor-dashboard](https://github.com/openedx/frontend-app-instructor-dashboard)

### Template

**Definition:** Page-level layout structures that define the high-level arrangement of organisms and molecules but do not contain actual instance data. Templates provide the structural blueprint for pages without being page-specific content.

**Open edX Examples:**
- `DashboardLayout` from [openedx/frontend-app-learner-dashboard](https://github.com/openedx/frontend-app-learner-dashboard)
- `EditorPage` from [openedx/frontend-app-authoring](https://github.com/openedx/frontend-app-authoring)

### Page

**Definition:** Concrete instances of templates where actual instance data is populated and rendered. Pages are the artifacts users interact with directly and represent the final, real-world output of the design system.

**Open edX Examples:**
- `CoursewareSearch` from [openedx/frontend-app-learning](https://github.com/openedx/frontend-app-learning)
- `Dashboard` from [openedx/frontend-app-learner-dashboard](https://github.com/openedx/frontend-app-learner-dashboard)
- `CourseOutline` and `StudioHome` from [openedx/frontend-app-authoring](https://github.com/openedx/frontend-app-authoring)
- Legacy `dashboard.html` from [openedx/edx-platform](https://github.com/openedx/edx-platform) (lms/templates/)

## Cross-MFE Patterns

### Repository Contributions by Level

The Open edX ecosystem distributes atomic level ownership across multiple repositories:

- **Atoms:** [openedx/paragon](https://github.com/openedx/paragon) is the single source of truth for primitive UI components. All MFEs import from Paragon rather than defining their own atoms.
- **Molecules, Organisms:** Micro Front-Ends (MFEs) contribute custom molecules and organisms based on their domain. For example, the learner dashboard defines `CourseCard` and `LearnerDashboardHeader`; the instructor dashboard defines `InstructorNav`.
- **Templates, Pages:** Each MFE defines its own templates and pages. [openedx/frontend-base](https://github.com/openedx/frontend-base) will eventually host cross-MFE chrome (shared layout structures).
- **Legacy Pages:** [openedx/edx-platform](https://github.com/openedx/edx-platform) contains Django template pages from the monolithic architecture; these are being progressively replaced by MFE pages.

### Future Direction

Over time, shared molecules and organisms will migrate to Paragon or a new cross-MFE component package (hosted in frontend-base or a dedicated package) as adoption patterns solidify. This prevents duplication and ensures consistency.

## Decision Rules for Classification

When classifying a component, use these rules to resolve ambiguity:

1. **Data fetching implies organism or higher.** If a component directly calls an API or manages its own data state beyond simple props, classify it as an organism (or above). Molecules are purely presentational.

2. **Layout or positioning isolation defines molecules and organisms.** If a component provides significant layout structuring (grid, flexbox arrangement of children), it is at least a molecule. Simple layout containers composed of a few atoms are molecules; complex layout orchestration is an organism.

3. **Domain or feature specificity indicates organism.** If a component is tightly coupled to a feature (e.g., "InstructorNav" is specific to the instructor dashboard), it is an organism. Reusable presentation patterns are molecules.

4. **Nesting depth as a tie-breaker.** Atoms are never nested; molecules nest only atoms; organisms nest molecules and atoms; templates and pages nest everything. Use composition depth as a secondary signal.

## See Also

- [Product Vision](../vision/product-vision.mdx) — Strategic direction and governance model
- [Contributing Guide](./contributing.md) — How to propose new components
- [Style Guide](./style-guide.md) — Writing and voice conventions
