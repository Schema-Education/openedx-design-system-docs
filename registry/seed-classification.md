# Open edX Component Registry — Seed Classification

> **Proof-of-concept seed data** for the component gallery. Every `atomicLevel` and `functionalCategory` value below is a first-pass inference and should be editable in the registry once the gallery ships. Compound subcomponents (`Form.X`, `DataTable.X`) are listed as independent rows so a card per subcomponent can be rendered if desired.

## Methodology

- **Atomic-level heuristic — Brad Frost**
  - **atom** — irreducible UI primitive; cannot be decomposed without losing functional meaning (Button, Input, Icon, Badge, Spinner, Label, Avatar).
  - **molecule** — a small composition of atoms acting as one functional unit (Form.Group = label + control + feedback; SearchField; Breadcrumb).
  - **organism** — a distinct, complex section composed of molecules and atoms (Navbar, Card, DataTable, Modal, Toast).
  - **template** — a page-level layout scaffold that arranges organisms (PageLayout, Stepper, Container, Stack).
  - **page** — a fully composed route-level instance of a template (rare in component libraries; common at the MFE level).

- **Functional category (secondary axis)** — orthogonal to atomic level, used as a grouping/filter chip in the gallery. Twelve categories chosen by surveying Polaris, Atlassian, Carbon, and Material 3:
  `Action` · `Input` · `Selection` · `Form` · `Navigation` · `Overlay` · `Feedback` · `Status` · `Display` · `Data` · `Media` · `Layout` · `Utility`

- **Sources merged into this list**
  - **Paragon** — github.com/openedx/paragon `src/` tree + paragon-openedx.netlify.app component index (97 entries; 15 deprecated).
  - **MFE sample** — 8 representative MFE repos (`frontend-app-learning`, `-authoring`, `-learner-dashboard`, `-profile`, `-account`, `-discussions`, `-communications`, `-library-authoring`) — 29 distinctive components.
  - **Industry canon** — union of components shipped by ≥3 of 10 systems (Polaris, Carbon, Material 3, Atlassian, Primer, Spectrum, shadcn, Chakra, Mantine, Radix). Used for gap analysis, not seeded directly.

---

## 1. Paragon component inventory (97 entries)

### Atoms (40)

| Name | Functional Category | One-line |
|---|---|---|
| Annotation | Display | Inline callout label anchored to content |
| Avatar | Display | Circular user image or initials placeholder |
| Badge | Status | Small status or count label |
| Bubble | Status | Compact numeric badge for notification counts |
| Button | Action | Clickable control that triggers an action |
| CheckBox *(deprecated)* | Selection | Binary checkbox — use Form.Checkbox |
| Chip | Selection | Compact selectable or dismissible label tag |
| CloseButton | Action | Icon-only button for dismissal |
| Code | Display | Monospace inline or block code renderer |
| Collapse | Utility | Primitive animating visible/hidden state |
| Fade | Utility | Opacity-fade transition wrapper |
| Form.Checkbox | Selection | Accessible checkbox within Form system |
| Form.Control | Input | Generic input element (text/email/select/textarea) |
| Form.Control.Feedback | Form | Helper or error text below a Form.Control |
| Form.Label | Form | Accessible label for a form control |
| Form.Radio | Selection | Accessible radio within Form system |
| Form.Switch | Selection | Toggle switch within Form system |
| Hyperlink | Navigation | Accessible anchor with external-link awareness |
| Icon | Display | SVG icon from the Paragon set |
| IconButton | Action | Icon-only button with accessible label |
| Image | Media | Accessible image with fluid/thumbnail variants |
| InputSelect *(deprecated)* | Input | Native select — use Form.Control |
| InputText *(deprecated)* | Input | Text input — use Form.Control |
| ListBoxOption | Selection | Single item within a ListBox |
| MailtoLink | Navigation | Anchor opening user's mail client |
| ModalLayer | Overlay | Low-level overlay backing all modals |
| Overlay | Overlay | Transparent backdrop behind modals/drawers |
| ProgressBar | Feedback | Horizontal task-completion indicator |
| ResponsiveEmbed *(deprecated)* | Media | Aspect-ratio iframe/video wrapper |
| Scrollable | Layout | Wrapper enabling overflow scroll |
| Skeleton | Feedback | Animated content-shape loading placeholder |
| Spinner | Feedback | Indeterminate circular loading indicator |
| Sticky | Layout | Wrapper applying position-sticky |
| TextArea *(deprecated)* | Input | Multi-line text input — use Form.Control |
| ToggleButton *(deprecated)* | Selection | Button toggling active/inactive |
| Tooltip | Overlay | Small hover/focus informational overlay |
| TransitionReplace | Utility | Animates swap between two children |
| Truncate | Display | Clamps text to N lines with ellipsis |
| ValidationMessage *(deprecated)* | Form | Inline validation error — use Form.Control.Feedback |

### Molecules (28)

| Name | Functional Category | One-line |
|---|---|---|
| ActionRow | Layout | Horizontal row organizing primary and secondary actions |
| AvatarButton | Action | Clickable avatar opening a user menu |
| Breadcrumb | Navigation | Hierarchical navigation trail |
| ButtonGroup | Action | Connected set of related buttons |
| CheckBoxGroup *(deprecated)* | Selection | Group of checkboxes with shared label |
| ChipCarousel | Selection | Scrollable row of filter chips |
| Collapsible | Container | Expandable/collapsible panel with trigger |
| ColorPicker | Input | Color-selection control with preview |
| DataTable.EmptyTable | Data | Empty-state placeholder inside DataTable |
| DataTable.TableFilters | Data | Filter panel for DataTable |
| DataTable.TableFooter | Data | Pagination/row-count footer for DataTable |
| Dropdown | Overlay | Trigger button revealing a menu list |
| Dropzone | Input | Drag-and-drop file-upload area |
| Figure | Media | Image with semantic caption |
| Form.Autosuggest | Input | Text input with predefined-option suggestions |
| Form.Group | Form | Wraps label + control + feedback as one field |
| IconButtonToggle | Action | Mutually exclusive pair of icon-button toggles |
| InputGroup | Input | Input combined with prepended/appended addons |
| ListBox | Selection | Accessible list of selectable options |
| Media *(deprecated)* | Media | Side-by-side image + text media object |
| Nav | Navigation | Active-state-managed navigation link list |
| OverflowScroll | Layout | Container enabling horizontal scroll |
| Pagination | Navigation | Page-number controls for paged data |
| Popover | Overlay | Contextual overlay anchored to a trigger |
| RadioButtonGroup *(deprecated)* | Selection | Group of radios with shared label |
| SearchField | Input | Text input combined with submit button |
| SelectableBox | Selection | Card-style selectable acting as checkbox/radio |
| SelectMenu | Selection | Single-value selection menu variant |
| StatefulButton | Action | Button cycling through labeled states |
| Tabs | Navigation | Tabbed switching between content panels |
| ValidationFormGroup *(deprecated)* | Form | Form group with validation state — use Form.Group |

### Organisms (24)

| Name | Functional Category | One-line |
|---|---|---|
| Alert | Feedback | Dismissible feedback banner with icon and actions |
| AlertModal | Overlay | Modal variant surfacing critical alerts |
| Card | Container | Surface container with header/body/footer slots |
| Carousel | Media | Horizontally scrollable slide panels |
| DataTable | Data | Full data grid with sort/filter/pagination |
| DataTable.BulkActions | Data | Bulk-action toolbar inside DataTable |
| DataTable.Table | Data | Core table element rendered within DataTable |
| DataTable.TableControlBar | Data | Search/filter/action toolbar for DataTable |
| Form | Form | Wrapper providing context for form fields |
| FullscreenModal | Overlay | Modal occupying the full viewport |
| MarketingModal | Overlay | Stylized modal for promo/onboarding content |
| Menu | Overlay | Floating list of menu items with keyboard nav |
| ModalDialog | Overlay | Accessible dialog with header/body/footer slots |
| ModalPopup | Overlay | Lightweight popover-style modal |
| Navbar | Navigation | Top-level application navigation bar |
| PageBanner | Feedback | Full-width informational banner pinned to top |
| ProductTour | Feedback | Step-by-step guided onboarding walkthrough |
| Sheet | Overlay | Side-anchored drawer panel |
| StandardModal | Overlay | Standard-size accessible modal dialog |
| StatusAlert *(deprecated)* | Feedback | Prominent status with dismiss — use Alert |
| Table *(deprecated)* | Data | Basic HTML table — use DataTable |
| Toast | Feedback | Ephemeral auto-dismissing notification |

### Templates (5)

| Name | Functional Category | One-line |
|---|---|---|
| Container | Layout | Responsive max-width page wrapper |
| Layout | Layout | Multi-column CSS grid scaffold |
| Stack | Layout | Flexbox utility stacking children with spacing |
| Stepper | Navigation | Multi-step flow scaffold with step indicators |

### Pages (0)

Paragon does not ship `page`-level components — by design. Pages live in MFEs.

---

## 2. MFE component sample (29 entries across 8 repos)

Pattern observed across every MFE: **one or two `*Page` route components → one or two `*Layout` templates → 3–8 organisms → a few MFE-specific molecules.** Atoms are nearly absent at the MFE level — those come from Paragon. This validates the atomic-design split between platform (Paragon) and product (MFEs).

| MFE Repo | Component | Atomic Level | Functional Category | What it does |
|---|---|---|---|---|
| frontend-app-account | AccountSettingsPage | page | Layout | Top-level route rendering all account settings |
| frontend-app-account | EditableField | molecule | Form | Inline-editable labeled field with save/cancel |
| frontend-app-account | EditableSelectField | molecule | Form | Inline-editable dropdown for profile selects |
| frontend-app-account | EmailField | molecule | Form | Editable field with email-specific validation |
| frontend-app-account | JumpNav | organism | Navigation | Sticky in-page anchor nav for settings sections |
| frontend-app-authoring | CourseOutline | organism | Data | Drag-and-drop course structure tree |
| frontend-app-authoring | CourseUnit | organism | Layout | Unit editor with sidebar, breadcrumbs, xblock iframe |
| frontend-app-authoring | EditorPage | page | Layout | Route-level xblock content editor |
| frontend-app-authoring | StudioHome | page | Layout | Studio landing listing courses and libraries |
| frontend-app-authoring | VideoSelector | organism | Media | Video picker for selecting/uploading assets |
| frontend-app-communications | BulkEmailTool | organism | Form | Bulk email composer with recipient targeting |
| frontend-app-discussions | Post | organism | Display | Full discussion post with header/body/footer |
| frontend-app-discussions | PostCommentsView | organism | Display | Threaded comments panel under a post |
| frontend-app-discussions | PostsList | organism | Data | Paginated filterable list of posts in a topic |
| frontend-app-discussions | PostsView | template | Layout | Layout shell pairing list + detail pane |
| frontend-app-learner-dashboard | CourseCard | organism | Display | Enrollment card with status, dates, actions |
| frontend-app-learner-dashboard | CourseFilterControls | molecule | Input | Filter bar for narrowing course list |
| frontend-app-learner-dashboard | CoursesPanel | organism | Data | Grid/list rendering enrolled course cards |
| frontend-app-learner-dashboard | Dashboard | page | Layout | Top-level learner dashboard route |
| frontend-app-learner-dashboard | EmailSettingsModal | molecule | Overlay | Modal for per-course email preferences |
| frontend-app-learning | Course | template | Layout | Primary courseware layout (sequence + sidebar) |
| frontend-app-learning | OutlineTab | page | Layout | Course home outline tab with progress |
| frontend-app-learning | ProgressTab | page | Layout | Course progress route — grades, certificate |
| frontend-app-learning | Sequence | organism | Navigation | Xblock sequence navigator with prev/next |
| frontend-app-learning | Sidebar | organism | Layout | Contextual course sidebar with pluggable widgets |
| frontend-app-library-authoring | LibraryAuthoringPage | page | Layout | Top-level library editing route |
| frontend-app-library-authoring | LibraryBlockCard | molecule | Display | Card for a single reusable content block |
| frontend-app-profile | CertificateCard | molecule | Display | Single earned certificate with download link |
| frontend-app-profile | ProfilePage | page | Layout | Learner public profile route |

---

## 3. Industry-canonical components: Paragon coverage audit

Of the 53 components shipped by ≥3 of 10 major design systems, **Paragon ships 43**. The 10 components below are the most notable gaps — every one is shipped by 5+ industry systems and absent from Paragon today. These are high-value candidates for the registry's "wishlist" or "request a component" backlog.

| Canonical Name | Atomic Level | Systems Count | Paragon equivalent? | Note |
|---|---|---|---|---|
| Switch (standalone) | atom | 8 | Form.Switch only | Form-coupled only; no standalone variant |
| Slider | atom | 9 | — | No slider/range input ships |
| Tag (vs. Chip) | atom | 6 | Chip overlaps | Chip is interactive; no read-only Tag |
| Combobox | organism | 7 | Form.Autosuggest partial | Autosuggest covers some cases, not full ARIA combobox |
| DatePicker | organism | 8 | — | Major gap; learners select dates frequently |
| Calendar | organism | 5 | — | Companion to DatePicker |
| HoverCard | molecule | 4 | Popover overlaps | Hover-specific affordance missing |
| ScrollArea | molecule | 4 | OverflowScroll partial | OverflowScroll is horizontal-only |
| SegmentedControl | molecule | 5 | IconButtonToggle partial | Toggle group exists; no text-segmented variant |
| Tree / TreeView | organism | 5 | — | Useful for course outline, navigation hierarchies |

---

## 4. Summary tallies

### Paragon (97 components)

| Atomic Level | Total | Active | Deprecated |
|---|---|---|---|
| atom | 40 | 33 | 7 |
| molecule | 28 | 25 | 3 |
| organism | 24 | 22 | 2 |
| template | 5 | 5 | 0 |
| page | 0 | 0 | 0 |
| **Total** | **97** | **85** | **12** |

### MFE sample (29 components from 8 repos)

| Atomic Level | Count |
|---|---|
| atom | 0 |
| molecule | 9 |
| organism | 14 |
| template | 3 |
| page | 9 |

The MFE-level distribution **inverts** Paragon's: organisms and pages dominate, atoms are absent. This is exactly the split that justifies the atomic taxonomy as the gallery's primary IA — Paragon owns atoms/molecules/lower-organisms; MFEs own higher-organisms/templates/pages.

### Functional category distribution (Paragon, active components only)

| Category | Count |
|---|---|
| Overlay | 12 |
| Action | 7 |
| Display | 7 |
| Form | 6 |
| Selection | 10 |
| Input | 7 |
| Navigation | 9 |
| Feedback | 8 |
| Data | 8 |
| Layout | 7 |
| Media | 3 |
| Status | 2 |
| Utility | 4 |

---

## 5. Notes for registry seeding

1. **Two metadata axes, both editable.** `atomicLevel` is the primary IA; `functionalCategory` is a secondary filter chip. The gallery's "Group by" toggle should switch between them. Other axes (`status`, `a11y`, `sourceMfe`, `consumers`) come from the existing JSON Schema.
2. **Compound subcomponents seed independently.** `Form.Control`, `Form.Group`, `DataTable.BulkActions` each render as their own card. The gallery should support a "parent component" link so they group together on demand without losing their individual presence.
3. **Deprecated components stay visible but pinned bottom.** 12 deprecated Paragon components remain in the seed list so consumers can find replacement guidance.
4. **MFE-level components are the gallery's killer feature.** No public design system catalog exposes a `sourceMfe` filter; the industry research confirmed this is greenfield. Seed all 29 MFE components and surface a "Group by source MFE" view from day one.
5. **Industry gap list (Section 3) should become a separate registry view** — "Wishlist" or "Requested components" — rather than empty cards in the main gallery.
6. **Pages live in MFEs, never in Paragon.** Reinforce this in governance docs to prevent scope creep into the platform layer.
