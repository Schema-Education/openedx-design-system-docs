'use client';

import { Alert, Badge, Card as PCard } from '@openedx/paragon';
import { ATOMIC_LEVEL_META, type GalleryComponent } from '@/lib/gallery';
import { PARAGON_PREVIEWS } from './paragon-previews';
import { PreviewErrorBoundary } from './preview-error-boundary';
import { COMPONENT_VARIANTS, type Variant } from './variants';

/**
 * Variant tile sizing.
 *
 * The default tile size (`sm`) fits compact atoms — buttons, icons, badges,
 * inputs. Larger sizes are reserved for components whose out-of-the-box
 * footprint is genuinely wider or taller (data tables, navbars, modals,
 * carousels, forms, page-level layouts). Capped at ~5× the default width and
 * ~3× the default height so the horizontal-scroll row still behaves.
 */
type TileSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const TILE_DIMENSIONS: Record<TileSize, { width: number; minHeight: number }> = {
  sm: { width: 260, minHeight: 160 },
  md: { width: 360, minHeight: 220 },
  lg: { width: 520, minHeight: 300 },
  xl: { width: 760, minHeight: 360 },
  xxl: { width: 1200, minHeight: 420 },
};

const COMPONENT_TILE_SIZE: Record<string, TileSize> = {
  // xxl — live <DataTable> instances; need width for control bar + columns +
  // pagination footer to read at the same density as the Paragon docs site.
  DataTable: 'xxl',
  'DataTable.Table': 'xxl',
  'DataTable.BulkActions': 'xxl',
  'DataTable.TableControlBar': 'xxl',
  'DataTable.TableFilters': 'xxl',
  'DataTable.TableFooter': 'xxl',
  'DataTable.EmptyTable': 'xxl',
  Table: 'xl',
  // xl — wide chrome / page-level surfaces with multi-zone layouts
  Navbar: 'xl',
  PageBanner: 'xl',
  Form: 'xl',
  Layout: 'lg',
  FullscreenModal: 'lg',
  MarketingModal: 'lg',
  // lg — multi-element structures (carousels, steppers, side panels, modals
  // with a header + body + footer)
  Carousel: 'lg',
  Stepper: 'lg',
  Sheet: 'lg',
  AlertModal: 'lg',
  StandardModal: 'lg',
  ModalDialog: 'lg',
  ModalPopup: 'lg',
  Dropzone: 'lg',
  ColorPicker: 'lg',
  ChipCarousel: 'lg',
  SelectableBox: 'lg',
  // md — moderate horizontal/vertical needs (single-row chrome, multi-line
  // alerts, small tabbed surfaces)
  Pagination: 'md',
  Tabs: 'md',
  Card: 'md',
  Container: 'md',
  Scrollable: 'md',
  Toast: 'md',
  Alert: 'md',
  StatusAlert: 'md',
  SearchField: 'md',
  Breadcrumb: 'md',
  Dropdown: 'md',
  Collapsible: 'md',
  Collapse: 'md',
  ActionRow: 'md',
  ButtonGroup: 'md',
  InputGroup: 'md',
  Popover: 'md',
  Menu: 'md',
  ProductTour: 'md',
  ModalLayer: 'md',
  Nav: 'md',
  ProgressBar: 'md',
  SelectMenu: 'md',
  TextArea: 'md',
  OverflowScroll: 'md',
  Media: 'md',
  Figure: 'md',
  Image: 'md',
  ResponsiveEmbed: 'md',
  'Form.Group': 'md',
  'Form.Autosuggest': 'md',
  CheckBoxGroup: 'md',
  RadioButtonGroup: 'md',
  ValidationFormGroup: 'md',
  // Everything else (atoms — Button, Badge, Icon, Avatar, single inputs,
  // sticky/overlay positioning helpers) falls through to `sm`.
};

function tileSizeFor(name: string): TileSize {
  return COMPONENT_TILE_SIZE[name] ?? 'sm';
}

/**
 * Long-form usage content rendered inside the summary pane's "Usage" tab.
 * Mirrors the surface found on the Paragon documentation site (variants,
 * usage examples, props, do/don'ts). The full content lands in Phase 2 —
 * for now this scaffolds the panel layout and re-uses the existing Paragon
 * preview registry so live components still render where one is available.
 *
 * The parent summary pane widens to 75vw when this tab is active to give
 * the long-form content room to breathe.
 */
export function UsageTab({ c }: { c: GalleryComponent }) {
  const atomic = ATOMIC_LEVEL_META[c.atomicLevel];
  const importPkg = c.sourceMfe === 'paragon' ? 'paragon' : c.sourceMfe;
  const previewRender =
    c.sourceMfe === 'paragon' ? PARAGON_PREVIEWS[c.name] : undefined;
  const previewNode = previewRender ? previewRender() : null;

  // Default tile renders the live Paragon preview when available, then either:
  //   - real per-component variants from COMPONENT_VARIANTS (Phase 2 content
  //     authored against the Paragon docs state matrix), or
  //   - placeholder tiles (Hover/Active/Disabled) for components without
  //     authored variants yet. Each tile is a fixed-width column in the
  //     horizontal scroller so the row can grow as variants are added.
  const tileSize = tileSizeFor(c.name);
  const tileDims = TILE_DIMENSIONS[tileSize];
  const authoredVariants: Variant[] | undefined = COMPONENT_VARIANTS[c.name];
  const variants: {
    label: string;
    description?: string;
    node: React.ReactNode;
    isPlaceholder: boolean;
  }[] = authoredVariants
    ? [
        {
          label: 'Default',
          node: previewNode ?? (
            <PreviewPlaceholder name={c.name} gradient={atomic.gradient} />
          ),
          isPlaceholder: !previewNode,
        },
        ...authoredVariants.map((v) => ({
          label: v.label,
          description: v.description,
          node: v.render(),
          isPlaceholder: false,
        })),
      ]
    : [
        {
          label: 'Default',
          node: previewNode ?? (
            <PreviewPlaceholder name={c.name} gradient={atomic.gradient} />
          ),
          isPlaceholder: !previewNode,
        },
        { label: 'Hover', node: null, isPlaceholder: true },
        { label: 'Active', node: null, isPlaceholder: true },
        { label: 'Disabled', node: null, isPlaceholder: true },
      ];

  return (
    <div className="space-y-8">
      {/* Preview + variants — horizontal scroll row.
          The first tile is the live "Default" render; the rest are
          placeholders for the variant states the crawler will populate in
          Phase 2 (hover, active, disabled, etc.). */}
      <Section
        title="Preview & Variants"
        subtitle="Live render plus variant states — Phase 2 (ADR-0001) wires in Sandpack for the placeholders"
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3">
            {variants.map((v) => (
              <VariantTile
                key={v.label}
                label={v.label}
                description={v.description}
                isPlaceholder={v.isPlaceholder}
                gradient={atomic.gradient}
                name={c.name}
                width={tileDims.width}
                minHeight={tileDims.minHeight}
              >
                {v.node}
              </VariantTile>
            ))}
          </div>
        </div>
      </Section>

      {/* Three-column row — develop (usage snippets + prop table),
          guidelines, and accessibility sit side-by-side at lg+. Develop
          stacks its snippets above the prop table within its own column.
          Drops to one column on narrow viewports. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Section
          title="Develop"
          subtitle="Snippets crawled from MFE consumers (Phase 2) and the prop table sourced from TypeScript / PropTypes (Phase 2b)"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <CodeBlock
                label="Import"
                code={`import { ${c.name} } from '@openedx/${importPkg}';`}
              />
              <CodeBlock label="Basic usage" code={`<${c.name} />`} />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Properties
              </div>
              <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
                Prop tables will be ingested directly from each component&apos;s
                source by the crawler in Phase 2b. See{' '}
                <code className="rounded bg-gray-100 px-1">
                  /registry/schema/component.schema.json
                </code>
                .
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Guidelines"
          subtitle="Editorial guidance authored alongside each component"
        >
          <div className="space-y-3">
            <Guideline kind="do" />
            <Guideline kind="dont" />
          </div>
        </Section>

        <Section
          title="Accessibility"
          subtitle="WCAG conformance and screen reader notes"
        >
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700">
            {c.a11y ? (
              <>
                Targets <strong>WCAG {c.a11y}</strong>. Detailed audit notes,
                keyboard interaction maps, and screen-reader scripts land in
                Phase 2b.
              </>
            ) : (
              <>Accessibility audit pending — see Phase 2b.</>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
      {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

// Paragon has no first-class code-block primitive, so the syntax surface
// stays as a native <pre>. The outer container is a Paragon Card so the
// chrome around the snippet still comes from the design system.
function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <PCard className="overflow-hidden !border-0">
        <pre className="m-0 overflow-x-auto rounded-md bg-gray-900 px-3 py-2 font-mono text-[11px] text-gray-100">
          <code>{code}</code>
        </pre>
      </PCard>
    </div>
  );
}

function VariantTile({
  label,
  description,
  isPlaceholder,
  gradient,
  name,
  width,
  minHeight,
  children,
}: {
  label: string;
  description?: string;
  isPlaceholder: boolean;
  gradient: string;
  name: string;
  width: number;
  minHeight: number;
  children: React.ReactNode;
}) {
  return (
    <PCard
      className="shrink-0 overflow-hidden"
      style={{ width }}
    >
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-3 py-2">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">
            {label}
          </div>
          {description && (
            <div className="truncate font-mono text-[10px] text-gray-500">
              {description}
            </div>
          )}
        </div>
        {isPlaceholder && (
          <Badge variant="light" className="shrink-0 !text-[9px] uppercase tracking-wide">
            Phase 2
          </Badge>
        )}
      </div>
      <div
        className={`flex flex-1 items-center justify-center overflow-auto p-4 ${
          isPlaceholder ? 'bg-gray-50' : 'bg-white'
        }`}
        style={{ minHeight }}
      >
        <PreviewErrorBoundary
          componentName={name}
          fallback={<PreviewPlaceholder name={name} gradient={gradient} compact />}
        >
          {children ?? <PreviewPlaceholder name={name} gradient={gradient} compact />}
        </PreviewErrorBoundary>
      </div>
    </PCard>
  );
}

function PreviewPlaceholder({
  name,
  gradient,
  compact,
}: {
  name: string;
  gradient: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-1.5' : 'gap-3'}`}>
      <div
        className={`flex items-center justify-center rounded-md bg-gradient-to-br ${gradient} font-mono font-bold text-white shadow ${
          compact ? 'h-10 w-10 text-sm' : 'h-14 w-14 text-xl'
        }`}
      >
        {name.charAt(0)}
      </div>
      <div className={`font-mono font-medium text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>
        {name}
      </div>
      {!compact && (
        <div className="text-[11px] text-gray-400">
          Live preview lands in Phase 2 (ADR-0001)
        </div>
      )}
    </div>
  );
}

function Guideline({ kind }: { kind: 'do' | 'dont' }) {
  const isDo = kind === 'do';
  return (
    <Alert variant={isDo ? 'success' : 'danger'} dismissible={false}>
      <div className="text-[10px] font-semibold uppercase tracking-wide">
        {isDo ? 'Do' : "Don't"}
      </div>
      <p className="mt-2 mb-0 text-xs">
        Guideline copy authored alongside each component in Phase 2.
      </p>
    </Alert>
  );
}
