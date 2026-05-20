'use client';

import { useMemo, useState } from 'react';
import { Button } from '@openedx/paragon';
import { ComponentCard } from './component-card';
import { ComponentDetail } from './component-detail';
import { MultiSelectCombobox } from './ui/multi-select-combobox';
import { AtomicLevelSegmented } from './ui/atomic-level-segmented';
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

  // Per-option counts and disabled-level set for the new filter controls.
  // countWithout(dimension, value) returns the number of components that
  // would match if all OTHER active filters apply but this dimension is
  // treated as "matches value".
  const { levelCounts, disabledLevels, statusOptions, categoryOptions, mfeOptions } = useMemo(() => {
    function countWithout<T>(
      dimension: 'level' | 'status' | 'category' | 'mfe',
      value: T,
    ): number {
      const q = search.trim().toLowerCase();
      return components.filter((c) => {
        if (dimension !== 'level' && selectedLevels.size > 0 && !selectedLevels.has(c.atomicLevel)) return false;
        if (dimension !== 'status' && selectedStatuses.size > 0 && !selectedStatuses.has(c.status)) return false;
        if (dimension !== 'category' && selectedCategories.size > 0 && !selectedCategories.has(c.functionalCategory)) return false;
        if (dimension !== 'mfe' && selectedMfes.size > 0 && !selectedMfes.has(c.sourceMfe)) return false;
        if (q) {
          const hay = `${c.name} ${c.description} ${c.sourceMfe} ${c.functionalCategory}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (dimension === 'level') return c.atomicLevel === value;
        if (dimension === 'status') return c.status === value;
        if (dimension === 'category') return c.functionalCategory === value;
        if (dimension === 'mfe') return c.sourceMfe === value;
        return true;
      }).length;
    }

    const levelCounts = Object.fromEntries(
      ATOMIC_LEVELS.map((lvl) => [lvl, countWithout('level', lvl)]),
    ) as Record<AtomicLevel, number>;

    const disabledLevels = new Set(
      ATOMIC_LEVELS.filter((lvl) => levelCounts[lvl] === 0),
    );

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

    return { levelCounts, disabledLevels, statusOptions, categoryOptions, mfeOptions };
  }, [components, search, selectedLevels, selectedStatuses, selectedCategories, selectedMfes, allMfes]);

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
          <Button as="a" href="/docs" variant="outline-primary" size="sm">
            Docs &amp; Vision
          </Button>
          <Button as="a" href="https://github.com/openedx/paragon" target="_blank" rel="noreferrer" variant="outline-primary" size="sm">
            Paragon repo ↗
          </Button>
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

      {/* Atomic level segmented */}
      <div className="mb-3">
        <AtomicLevelSegmented
          levels={ATOMIC_LEVELS}
          selected={selectedLevels}
          onChange={setSelectedLevels}
          disabledLevels={disabledLevels}
          counts={levelCounts}
        />
      </div>

      {/* Status / Category / Source MFE multi-selects */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <MultiSelectCombobox
          label="Status"
          options={statusOptions}
          selected={selectedStatuses}
          onChange={setSelectedStatuses}
          placeholder="Search statuses…"
        />
        <MultiSelectCombobox
          label="Category"
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Search categories…"
        />
        <MultiSelectCombobox
          label="Source MFE"
          options={mfeOptions}
          selected={selectedMfes}
          onChange={setSelectedMfes}
          placeholder="Search MFEs…"
        />
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
