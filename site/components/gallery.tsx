'use client';

import { useMemo, useState } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { ComponentCard } from './component-card';
import { ComponentRow } from './component-row';
import { ComponentDetail } from './component-detail';
import { MultiSelectCombobox } from './ui/multi-select-combobox';
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
  const [groupBy, setGroupBy] = useState<GroupBy>('atomicLevel');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selected, setSelected] = useState<GalleryComponent | null>(null);

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
                  className={`relative -mb-px flex items-baseline gap-2 px-4 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                    isActive
                      ? 'border-b-2 border-[#0a3055] font-semibold text-[#0a3055]'
                      : 'border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900'
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

      <div className="mx-auto max-w-[1650px]">
        {/* Two-column body: filters + cards on the left, detail sidebar flush to the right */}
        <div className="flex items-start">
          {/* Main column — search/filters + grouped card grid (owns the horizontal padding) */}
          <div className="min-w-0 flex-1 px-6 pb-6 pt-4">
            {/* Search + filters + group-by — group-by anchors to right edge of THIS column */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-1/4 sm:min-w-[220px] sm:flex-shrink-0">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search components"
                  className="w-full rounded-md border border-gray-500 bg-white py-2 pl-9 pr-3 text-sm focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                </svg>
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
                    className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                      selected
                        ? 'lg:grid-cols-1 xl:grid-cols-2'
                        : 'lg:grid-cols-2 xl:grid-cols-3'
                    }`}
                  >
                    {group.items.map((c) => (
                      <ComponentCard
                        key={`${c.sourceMfe}-${c.slug}`}
                        component={c}
                        onClick={() => setSelected(c)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {group.items.map((c) => (
                      <ComponentRow
                        key={`${c.sourceMfe}-${c.slug}`}
                        component={c}
                        onClick={() => setSelected(c)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Right sidebar — flush to top dividing line and to the right edge of the layout */}
          {selected && (
            <div className="sticky top-[102px] w-full max-w-md flex-shrink-0 self-start h-[calc(100vh-102px)] overflow-y-auto border-l border-gray-200 bg-white">
              <ComponentDetail
                component={selected}
                onClose={() => setSelected(null)}
                onSelectConsumer={(mfe) => {
                  setSelectedMfes(new Set([mfe]));
                  setSelected(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
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
  const baseBtn =
    'flex h-7 w-7 items-center justify-center transition focus:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-gray-500';
  return (
    <div
      role="group"
      aria-label="View mode"
      className="inline-flex overflow-hidden rounded-md border border-gray-300 bg-white"
    >
      <button
        type="button"
        onClick={() => onChange('card')}
        aria-pressed={value === 'card'}
        aria-label="Card view"
        title="Card view"
        className={`${baseBtn} ${
          value === 'card'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="List view"
        title="List view"
        className={`${baseBtn} border-l border-gray-300 ${
          value === 'list'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>
    </div>
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
