'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { IconButton, IconButtonToggle, Icon } from '@openedx/paragon';
import { GridView, ViewList } from '@openedx/paragon/icons';
import { ComponentCard } from './component-card';
import { ComponentRow } from './component-row';
import { ComponentDetail, type DetailTab } from './component-detail';
import { MultiSelectCombobox } from './ui/multi-select-combobox';
import { CommandPalette, usePaletteHotkey } from './command-palette';
import { Kbd } from './ui/kbd';
import {
  ATOMIC_LEVELS,
  ATOMIC_LEVEL_META,
  STATUSES,
  STATUS_META,
  FUNCTIONAL_CATEGORIES,
  type GalleryComponent,
  type GroupBy,
} from '@/lib/gallery';
import type { AtomicLevel } from '@/lib/registry';

type ActiveLevel = 'all' | AtomicLevel;
type ViewMode = 'card' | 'list';

interface GalleryProps {
  components: GalleryComponent[];
}

export function Gallery({ components }: GalleryProps) {
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState<ActiveLevel>('all');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['stable', 'experimental']));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedMfes, setSelectedMfes] = useState<Set<string>>(new Set());
  // Default to functionalCategory so the first cards on the page surface the
  // Action group (Button family) — the components with the richest variant
  // coverage in the Usage tab. Users can switch via the Group-by listbox.
  const [groupBy, setGroupBy] = useState<GroupBy>('functionalCategory');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selected, setSelected] = useState<GalleryComponent | null>(null);
  // Global ⌘K command palette state. The palette is a sibling of the gallery's
  // result grid and writes back through `selectComponent` — see PR 1 plan.
  const [paletteOpen, setPaletteOpen] = useState(false);
  usePaletteHotkey(() => setPaletteOpen((o) => !o));
  // Tab state lives here (rather than inside the details pane) because the
  // active tab drives the pane width — Usage expands the pane to 75vw so the
  // long-form documentation surface has room to breathe.
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const isUsageTab = detailTab === 'usage';

  function clearSelection() {
    setSelected(null);
    setDetailTab('overview');
  }

  // Switching components resets to the Overview tab so the user lands on a
  // consistent first surface regardless of the previous selection's state.
  function selectComponent(c: GalleryComponent) {
    setSelected(c);
    setDetailTab('overview');
  }

  // Details pane resize state.
  // Default width matches the prior `max-w-md` (28rem = 448px).
  // Min width keeps the pane readable; max width is computed dynamically so
  // the main listing area never shrinks below one 320px card column plus
  // its horizontal padding (px-6 = 24px each side).
  const DEFAULT_PANE_WIDTH = 448;
  const MIN_PANE_WIDTH = 320;
  const MAIN_MIN_WIDTH = 320 + 48;
  const [paneWidth, setPaneWidth] = useState<number>(DEFAULT_PANE_WIDTH);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  // Mirrors isResizingRef in state form so we can swap the inline width
  // transition off during an active drag (a transition during pointer-move
  // would make the pane lag behind the cursor).
  const [isResizing, setIsResizing] = useState(false);
  // Standard easing for the pane expand/collapse animation. ~280ms with a
  // gentle ease-out curve feels deliberate without dragging. Disabled during
  // an active resize drag — otherwise the pane would lag the cursor.
  const PANE_TRANSITION =
    'width 280ms cubic-bezier(0.22, 1, 0.36, 1), padding-left 280ms cubic-bezier(0.22, 1, 0.36, 1), padding-right 280ms cubic-bezier(0.22, 1, 0.36, 1)';
  const paneTransition = isResizing ? 'none' : PANE_TRANSITION;

  useEffect(() => {
    function clampToBounds(width: number): number {
      const rect = bodyRef.current?.getBoundingClientRect();
      const containerWidth = rect?.width ?? width + MAIN_MIN_WIDTH;
      const maxPane = Math.max(MIN_PANE_WIDTH, containerWidth - MAIN_MIN_WIDTH);
      return Math.min(maxPane, Math.max(MIN_PANE_WIDTH, width));
    }

    function onMove(e: PointerEvent) {
      if (!isResizingRef.current || !bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();
      const next = rect.right - e.clientX;
      setPaneWidth(clampToBounds(next));
    }
    function onUp() {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    function onResize() {
      setPaneWidth((w) => clampToBounds(w));
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function startResize(e: React.PointerEvent) {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  // Derive list of distinct source MFEs
  const allMfes = useMemo(() => {
    const set = new Set<string>();
    components.forEach((c) => set.add(c.sourceMfe));
    return Array.from(set).sort();
  }, [components]);

  // Filter + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return components.filter((c) => {
      if (activeLevel !== 'all' && c.atomicLevel !== activeLevel) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(c.functionalCategory)) return false;
      if (selectedMfes.size > 0 && !selectedMfes.has(c.sourceMfe)) return false;
      if (q) {
        const hay = `${c.name} ${c.description} ${c.sourceMfe} ${c.functionalCategory}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [components, search, activeLevel, selectedStatuses, selectedCategories, selectedMfes]);

  // Per-option counts (status / category / mfe respect ALL other active filters
  // including the current atomic-level tab). Tab counts respect everything
  // EXCEPT the level dimension, so each tab shows what would be matched if
  // selected.
  const { levelTabCounts, statusOptions, categoryOptions, mfeOptions } = useMemo(() => {
    function countWithout(
      dimension: 'level' | 'status' | 'category' | 'mfe',
      value: string,
    ): number {
      const q = search.trim().toLowerCase();
      return components.filter((c) => {
        if (dimension !== 'level' && activeLevel !== 'all' && c.atomicLevel !== activeLevel) return false;
        if (dimension !== 'status' && selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
        if (dimension !== 'category' && selectedCategories.size > 0 && !selectedCategories.has(c.functionalCategory)) return false;
        if (dimension !== 'mfe' && selectedMfes.size > 0 && !selectedMfes.has(c.sourceMfe)) return false;
        if (q) {
          const hay = `${c.name} ${c.description} ${c.sourceMfe} ${c.functionalCategory}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (dimension === 'level') return value === 'all' ? true : c.atomicLevel === value;
        if (dimension === 'status') return c.status === value;
        if (dimension === 'category') return c.functionalCategory === value;
        if (dimension === 'mfe') return c.sourceMfe === value;
        return true;
      }).length;
    }

    const levelTabCounts: Record<ActiveLevel, number> = {
      all: countWithout('level', 'all'),
      atom: countWithout('level', 'atom'),
      molecule: countWithout('level', 'molecule'),
      organism: countWithout('level', 'organism'),
      template: countWithout('level', 'template'),
      page: countWithout('level', 'page'),
    };

    const statusOptions = STATUSES.map((s) => ({
      value: s,
      label: STATUS_META[s].label,
      count: countWithout('status', s),
      color: STATUS_META[s].color,
    }));

    const categoryOptions = FUNCTIONAL_CATEGORIES.map((cat) => ({
      value: cat,
      label: cat,
      count: countWithout('category', cat),
    }));

    const mfeOptions = allMfes.map((mfe) => ({
      value: mfe,
      label: mfe,
      count: countWithout('mfe', mfe),
    }));

    return { levelTabCounts, statusOptions, categoryOptions, mfeOptions };
  }, [components, search, activeLevel, selectedStatuses, selectedCategories, selectedMfes, allMfes]);

  // Group filtered results
  const grouped = useMemo(() => {
    if (groupBy === 'flat') {
      const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      return [{ key: 'All components', items: sorted }];
    }
    const map = new Map<string, GalleryComponent[]>();
    filtered.forEach((c) => {
      const key = c[groupBy] as string;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    const entries = Array.from(map.entries()).map(([key, items]) => ({
      key,
      items: items.sort((a, b) => {
        // deprecated to bottom inside each group
        if (a.status === 'deprecated' && b.status !== 'deprecated') return 1;
        if (b.status === 'deprecated' && a.status !== 'deprecated') return -1;
        return a.name.localeCompare(b.name);
      }),
    }));
    // Sort groups
    if (groupBy === 'atomicLevel') {
      entries.sort((a, b) => {
        return (
          ATOMIC_LEVEL_META[a.key as AtomicLevel].order -
          ATOMIC_LEVEL_META[b.key as AtomicLevel].order
        );
      });
    } else {
      entries.sort((a, b) => a.key.localeCompare(b.key));
    }
    return entries;
  }, [filtered, groupBy]);

  function clearAll() {
    setSelectedStatuses(new Set(['stable', 'experimental']));
    setSelectedCategories(new Set());
    setSelectedMfes(new Set());
    setSearch('');
  }

  // Tab changes don't count as a "filter" for Clear All purposes — they are
  // navigation, not refinement.
  const nonTabFilterCount =
    (search.trim() ? 1 : 0) +
    selectedCategories.size +
    selectedMfes.size +
    (selectedStatuses.size === 2 && selectedStatuses.has('stable') && selectedStatuses.has('experimental') ? 0 : selectedStatuses.size);

  // Tab definitions — pluralized labels (mirrors authoring Library page pattern)
  const tabs: { key: ActiveLevel; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'atom', label: 'Atoms' },
    { key: 'molecule', label: 'Molecules' },
    { key: 'organism', label: 'Organisms' },
    { key: 'template', label: 'Templates' },
    { key: 'page', label: 'Pages' },
  ];

  return (
    <>
      {/* Page title row — inside content frame */}
      <div className="mx-auto max-w-[1650px] px-6 pt-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Component library</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Component Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">
              {components.length} components across Paragon, frontend-base, and {allMfes.length - 2} MFEs · atoms through pages
            </p>
          </div>
        </div>
      </div>

      {/* Subnav — full-width divider, tabs constrained to content frame, sticky below app header */}
      <div className="sticky top-16 z-20 border-b border-gray-200 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
        <div className="mx-auto max-w-[1650px] px-6">
          <div role="tablist" aria-label="Atomic level" className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const isActive = activeLevel === tab.key;
              const count = levelTabCounts[tab.key];
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveLevel(tab.key)}
                  className={`relative -mb-px flex items-baseline gap-2 rounded-t-md px-4 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055] ${
                    isActive
                      ? 'border-b-2 border-[#0a3055] font-semibold text-[#0a3055]'
                      : 'border-b-2 border-transparent font-medium text-gray-700 hover:bg-[#0a3055]/10 hover:text-[#0a3055]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs ${isActive ? 'text-[#0a3055]/70' : 'text-gray-600'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Body — main listing on the left, summary pane on the right.
            The flex container is full-viewport-width so the summary pane
            sits flush against the right edge of the viewport. The main
            column gets dynamic left padding (and right padding, when no
            pane is open) so its content stays aligned with the title row
            above, which is centered at max-w-[1650px]. When the Usage tab
            is active the pane expands to 75vw and the listing shrinks to
            the remaining 25vw. */}
        <div ref={bodyRef} className="flex items-start">
          {/* Main column — search/filters + grouped card grid.
              Uses an explicit width (rather than flex-grow) so the width can
              transition smoothly. The summary pane sibling has flex-shrink:0
              so it keeps its set width; the main column fills whatever space
              remains via the `width` calc. */}
          <div
            className="min-w-0 pb-6 pt-4"
            style={{
              flexGrow: 0,
              flexShrink: 0,
              width: isUsageTab
                ? '25vw'
                : selected
                ? `calc(100vw - ${paneWidth}px)`
                : '100vw',
              paddingLeft: isUsageTab
                ? '1.5rem'
                : 'max(1.5rem, calc((100vw - 1650px) / 2 + 1.5rem))',
              paddingRight: isUsageTab || selected
                ? '1.5rem'
                : 'max(1.5rem, calc((100vw - 1650px) / 2 + 1.5rem))',
              transition: paneTransition,
            }}
          >
            {/* Search + filters + group-by — group-by anchors to right edge of THIS column */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-1/4 sm:min-w-[220px] sm:flex-shrink-0">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search components"
                  className="w-full rounded-md border border-gray-500 bg-white py-2 pl-9 pr-12 text-sm focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                </svg>
                {/* ⌘K hint — opens the global command palette. Lives inside
                    the inline search so the affordance is discoverable without
                    adding a new toolbar slot. */}
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded px-1 py-0.5 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                  aria-label="Open command palette"
                  title="Search all components (⌘K)"
                >
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </button>
              </div>
              {/* Status filter hidden for now — re-enable when status lifecycle is finalized. */}
              {/* <MultiSelectCombobox
                label="Status"
                options={statusOptions}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Search statuses…"
              /> */}
              <MultiSelectCombobox
                label="Category"
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Search categories…"
              />
              <MultiSelectCombobox
                label="Source"
                options={mfeOptions}
                selected={selectedMfes}
                onChange={setSelectedMfes}
                placeholder="Search sources…"
              />
              <div className="ml-auto flex items-center gap-2">
                <GroupByListbox value={groupBy} onChange={setGroupBy} />
                <ViewModeToggle value={viewMode} onChange={setViewMode} />
              </div>

            </div>

            {/* Result count + Clear All (only when non-tab filters are active) */}
            <div className="mb-4 text-xs text-gray-500">
              Showing <span className="font-medium text-gray-800">{filtered.length}</span> of {components.length} components
              {nonTabFilterCount > 0 && (
                <>
                  {' · '}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-medium text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500">
                No components match the current filters.
              </div>
            )}

            {grouped.map((group) => (
              <section key={group.key} className="mb-10">
                <h2 className="mb-3 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  {groupBy === 'atomicLevel'
                    ? ATOMIC_LEVEL_META[group.key as AtomicLevel].label + 's'
                    : group.key}
                  <span className="font-mono text-xs font-normal text-gray-600">{group.items.length}</span>
                </h2>
                {viewMode === 'card' ? (
                  <div
                    className={`grid gap-5 ${
                      isUsageTab
                        ? 'grid-cols-1'
                        : selected
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                    }`}
                  >
                    {group.items.map((c) => (
                      <ComponentCard
                        key={`${c.sourceMfe}-${c.slug}`}
                        component={c}
                        onClick={() => selectComponent(c)}
                        isSelected={
                          selected?.sourceMfe === c.sourceMfe &&
                          selected?.slug === c.slug
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {group.items.map((c) => (
                      <ComponentRow
                        key={`${c.sourceMfe}-${c.slug}`}
                        component={c}
                        onClick={() => selectComponent(c)}
                        isSelected={
                          selected?.sourceMfe === c.sourceMfe &&
                          selected?.slug === c.slug
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Summary pane — sits flush against the viewport right edge.
              Width is user-resizable via the left-edge drag handle on every
              tab except Usage; on the Usage tab the pane expands to 75vw so
              the long-form documentation surface has room to breathe. */}
          {selected && (
            <div
              className="sticky top-[102px] flex-shrink-0 self-start h-[calc(100vh-102px)] border-l border-gray-200 bg-white relative"
              style={{
                width: isUsageTab ? '75vw' : paneWidth,
                transition: paneTransition,
              }}
            >
              {!isUsageTab && (
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize details pane"
                  onPointerDown={startResize}
                  className="group absolute left-0 top-0 z-10 h-full w-1.5 -translate-x-1/2 cursor-col-resize"
                >
                  <div className="mx-auto h-full w-px bg-transparent transition-colors group-hover:bg-gray-400" />
                </div>
              )}
              <div className="h-full overflow-y-auto">
                <ComponentDetail
                  component={selected}
                  tab={detailTab}
                  onTabChange={setDetailTab}
                  onClose={clearSelection}
                  onSelectConsumer={(mfe) => {
                    setSelectedMfes(new Set([mfe]));
                    clearSelection();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global ⌘K command palette. Fixed-positioned dialog; mounted as a
          sibling of the main grid so it overlays everything when open. */}
      <CommandPalette
        components={components}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectComponent={selectComponent}
      />
    </>
  );
}

function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <IconButtonToggle
      activeValue={value}
      onChange={(v: string) => onChange(v as ViewMode)}
    >
      <IconButton
        value="card"
        src={GridView}
        iconAs={Icon}
        alt="Card view"
        variant="primary"
        size="sm"
      />
      <IconButton
        value="list"
        src={ViewList}
        iconAs={Icon}
        alt="List view"
        variant="primary"
        size="sm"
      />
    </IconButtonToggle>
  );
}

const GROUP_BY_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'atomicLevel', label: 'Atomic level' },
  { value: 'functionalCategory', label: 'Category' },
  { value: 'sourceMfe', label: 'Source MFE' },
  { value: 'flat', label: 'Flat (A-Z)' },
];

function GroupByListbox({
  value,
  onChange,
}: {
  value: GroupBy;
  onChange: (v: GroupBy) => void;
}) {
  const current = GROUP_BY_OPTIONS.find((o) => o.value === value) ?? GROUP_BY_OPTIONS[0];
  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500">
            <span className="font-medium text-gray-600">Group by</span>
            <span>{current.label}</span>
            <svg className="h-3 w-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute right-0 z-20 mt-1 min-w-[10rem] origin-top-right rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg focus:outline-none">
              {GROUP_BY_OPTIONS.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    `cursor-pointer px-3 py-1.5 ${
                      active ? 'bg-gray-100' : ''
                    } ${selected ? 'font-semibold text-gray-900' : 'text-gray-700'}`
                  }
                >
                  {opt.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
