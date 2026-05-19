'use client';

import { useMemo, useState } from 'react';
import { ComponentCard } from './component-card';
import { ComponentDetail } from './component-detail';
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

interface GalleryProps {
  components: GalleryComponent[];
}

export function Gallery({ components }: GalleryProps) {
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Set<AtomicLevel>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['stable', 'experimental']));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedMfes, setSelectedMfes] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<GroupBy>('atomicLevel');
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
      if (selectedLevels.size > 0 && !selectedLevels.has(c.atomicLevel)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(c.functionalCategory)) return false;
      if (selectedMfes.size > 0 && !selectedMfes.has(c.sourceMfe)) return false;
      if (q) {
        const hay = `${c.name} ${c.description} ${c.sourceMfe} ${c.functionalCategory}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [components, search, selectedLevels, selectedStatuses, selectedCategories, selectedMfes]);

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

  function toggle<T>(set: Set<T>, item: T, setFn: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setFn(next);
  }

  function clearAll() {
    setSelectedLevels(new Set());
    setSelectedStatuses(new Set(['stable', 'experimental']));
    setSelectedCategories(new Set());
    setSelectedMfes(new Set());
    setSearch('');
  }

  const activeFilterCount =
    selectedLevels.size +
    selectedCategories.size +
    selectedMfes.size +
    (selectedStatuses.size === 2 && selectedStatuses.has('stable') && selectedStatuses.has('experimental') ? 0 : selectedStatuses.size);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Component Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            {components.length} components across Paragon and {allMfes.length - 1} MFEs · atoms through pages
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <a href="/docs" className="rounded-md border border-gray-200 px-3 py-1.5 font-medium hover:bg-gray-50">
            Docs &amp; Vision
          </a>
          <a href="https://github.com/openedx/paragon" target="_blank" rel="noreferrer" className="rounded-md border border-gray-200 px-3 py-1.5 font-medium hover:bg-gray-50">
            Paragon repo ↗
          </a>
        </div>
      </div>

      {/* Search + group-by */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components, MFEs, descriptions…"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-9 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <svg className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-medium">Group by</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
          >
            <option value="atomicLevel">Atomic level</option>
            <option value="functionalCategory">Functional category</option>
            <option value="sourceMfe">Source MFE</option>
            <option value="flat">Flat (A-Z)</option>
          </select>
        </label>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="mb-6 space-y-2">
        <FilterRow label="Atomic level">
          {ATOMIC_LEVELS.map((lvl) => (
            <Chip
              key={lvl}
              active={selectedLevels.has(lvl)}
              onClick={() => toggle(selectedLevels, lvl, setSelectedLevels)}
              color={ATOMIC_LEVEL_META[lvl].color}
            >
              {ATOMIC_LEVEL_META[lvl].label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Status">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              active={selectedStatuses.has(s)}
              onClick={() => toggle(selectedStatuses, s, setSelectedStatuses)}
              color={STATUS_META[s].color}
            >
              {STATUS_META[s].label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Source MFE">
          {allMfes.map((mfe) => (
            <Chip
              key={mfe}
              active={selectedMfes.has(mfe)}
              onClick={() => toggle(selectedMfes, mfe, setSelectedMfes)}
              color="bg-gray-100 text-gray-700"
            >
              {mfe}
            </Chip>
          ))}
        </FilterRow>
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-800">
            More filters: functional category
          </summary>
          <div className="mt-2">
            <FilterRow label="Category">
              {FUNCTIONAL_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  active={selectedCategories.has(cat)}
                  onClick={() => toggle(selectedCategories, cat, setSelectedCategories)}
                  color="bg-gray-100 text-gray-700"
                >
                  {cat}
                </Chip>
              ))}
            </FilterRow>
          </div>
        </details>
      </div>

      {/* Result count */}
      <div className="mb-4 text-xs text-gray-500">
        Showing <span className="font-medium text-gray-800">{filtered.length}</span> of {components.length} components
      </div>

      {/* Groups */}
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
            <span className="font-mono text-xs font-normal text-gray-400">{group.items.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.items.map((c) => (
              <ComponentCard key={`${c.sourceMfe}-${c.slug}`} component={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        </section>
      ))}

      <ComponentDetail
        component={selected}
        onClose={() => setSelected(null)}
        onSelectConsumer={(mfe) => {
          setSelectedMfes(new Set([mfe]));
          setSelected(null);
        }}
      />
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-2 w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
        active
          ? `${color} ring-2 ring-offset-1 ring-gray-400`
          : `${color} opacity-60 hover:opacity-100`
      }`}
    >
      {children}
    </button>
  );
}
