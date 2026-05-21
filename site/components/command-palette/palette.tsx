'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';
import { Kbd } from '../ui/kbd';
import { rankComponents } from '@/lib/palette-ranking';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';
import {
  rankCommands,
  suggestedCommands,
  type GalleryCommand,
} from '@/lib/palette-commands';
import { useRecentSelections } from './use-recent';

interface CommandPaletteProps {
  /** Full component dataset — search domain for "All" scope, source for Recent hydration. */
  components: GalleryComponent[];
  /**
   * Components matching the gallery's currently-applied filter chips (and the
   * gallery's inline search input). When the palette is in "filtered" scope,
   * this is what we search. Pass `null`/undefined to disable filter-first.
   */
  filteredComponents?: GalleryComponent[];
  /**
   * Whether the gallery currently has *any* user-applied filters. Drives the
   * scope default on open: filters → 'filtered'; no filters → 'all'.
   */
  hasActiveFilters: boolean;
  /** Commands surfaced alongside components — see lib/palette-commands. */
  commands: GalleryCommand[];
  open: boolean;
  onClose: () => void;
  onSelectComponent: (c: GalleryComponent) => void;
  /**
   * Set the gallery's Source-MFE filter to exactly this slug. Used by the
   * "Source MFEs" quick-jump section.
   */
  onFilterByMfe: (mfe: string) => void;
}

/**
 * Global ⌘K command palette — PR 3 / 3 (final).
 *
 * Scope of this PR (additions over PR 2):
 * - **Filter-first scope toggle** — when the gallery has active filter chips,
 *   the palette defaults to searching within them (Storybook's documented
 *   tags-narrow-before-search behavior). ⌘⇧A widens to all components.
 *   Footer chip shows current scope and is clickable.
 * - **Source-MFE quick-jump** — when the query matches a known MFE slug
 *   (e.g. "learning", "authoring"), a "Source MFEs" section appears above
 *   components offering to set the source filter to that MFE.
 */

type PaletteItem =
  | { kind: 'component'; component: GalleryComponent }
  | { kind: 'command'; command: GalleryCommand }
  | { kind: 'mfe-filter'; mfe: string; count: number };

function itemKey(item: PaletteItem): string {
  if (item.kind === 'component') {
    return `c:${item.component.sourceMfe}|${item.component.slug}`;
  }
  if (item.kind === 'command') return `k:${item.command.id}`;
  return `m:${item.mfe}`;
}

type Scope = 'filtered' | 'all';

export function CommandPalette({
  components,
  filteredComponents,
  hasActiveFilters,
  commands,
  open,
  onClose,
  onSelectComponent,
  onFilterByMfe,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('all');
  const { recent, pushRecent } = useRecentSelections(components);

  // Reset state every time the palette opens. Scope defaults to 'filtered'
  // only when the gallery has active filters; otherwise 'all' is the natural
  // start point and would otherwise produce a confusing 0-result search.
  useEffect(() => {
    if (open) {
      setQuery('');
      setScope(hasActiveFilters && filteredComponents ? 'filtered' : 'all');
    }
  }, [open, hasActiveFilters, filteredComponents]);

  // ⌘⇧A toggles scope while the palette is open. Bound to window (rather than
  // the dialog) so it fires even if focus drifts off the input.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod || !e.shiftKey) return;
      if (e.key === 'A' || e.key === 'a') {
        e.preventDefault();
        setScope((s) => (s === 'filtered' ? 'all' : 'filtered'));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // MFE catalog with counts, computed from the FULL component list so the
  // quick-jump count reflects total components even when scope is filtered.
  const mfeStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of components) {
      counts.set(c.sourceMfe, (counts.get(c.sourceMfe) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([mfe, count]) => ({ mfe, count }))
      .sort((a, b) => a.mfe.localeCompare(b.mfe));
  }, [components]);

  // Source domain for component ranking — flips with scope.
  const searchDomain =
    scope === 'filtered' && filteredComponents ? filteredComponents : components;

  const rankedComponents = useMemo(
    () => rankComponents(searchDomain, query, 8).map((r) => r.component),
    [searchDomain, query],
  );
  const rankedCommandList = useMemo(
    () => rankCommands(commands, query, 6),
    [commands, query],
  );
  const rankedMfes = useMemo(() => rankMfes(mfeStats, query, 4), [mfeStats, query]);
  const suggested = useMemo(() => suggestedCommands(commands, 4), [commands]);

  const hasQuery = query.trim().length > 0;

  const mfeItems: PaletteItem[] = hasQuery
    ? rankedMfes.map((m) => ({ kind: 'mfe-filter', mfe: m.mfe, count: m.count }))
    : [];
  const componentItems: PaletteItem[] = (hasQuery ? rankedComponents : recent).map(
    (c) => ({ kind: 'component', component: c }),
  );
  const commandItems: PaletteItem[] = (hasQuery ? rankedCommandList : suggested).map(
    (cmd) => ({ kind: 'command', command: cmd }),
  );

  const componentSectionLabel = hasQuery ? 'Components' : 'Recent';
  const commandSectionLabel = hasQuery ? 'Commands' : 'Suggested';

  const totalResults =
    mfeItems.length + componentItems.length + commandItems.length;

  function handleSelect(item: PaletteItem | null) {
    if (!item) return;
    if (item.kind === 'component') {
      pushRecent(item.component);
      onSelectComponent(item.component);
    } else if (item.kind === 'command') {
      item.command.perform();
    } else {
      onFilterByMfe(item.mfe);
    }
    onClose();
  }

  const scopeWidens = scope === 'filtered' && !!filteredComponents;
  const scopeCount = scope === 'filtered' && filteredComponents
    ? filteredComponents.length
    : components.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      aria-label={`Search ${scopeCount} components and ${commands.length} commands`}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition duration-150 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-[15vh] sm:p-6 sm:pt-[15vh]">
        <DialogPanel
          transition
          className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <Combobox<PaletteItem | null>
            onChange={handleSelect}
            // Selecting any item closes the dialog; never keep a "checked"
            // value across opens.
            value={null}
            immediate
          >
            {/* Input row */}
            <div className="flex items-center gap-2 border-b border-gray-200 px-4">
              <SearchIcon />
              <ComboboxInput
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  scopeWidens
                    ? `Search ${scopeCount} filtered components (⌘⇧A to widen)`
                    : 'Search components or run a command — try "Card", "deprecated", or "group by"'
                }
                className="flex-1 border-0 bg-transparent py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                aria-label="Search components and commands"
              />
              <Kbd>esc</Kbd>
            </div>

            {/* Results */}
            <ComboboxOptions
              static
              className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto"
            >
              {totalResults === 0 ? (
                <EmptyState
                  query={query}
                  total={scopeCount}
                  scope={scope}
                  hasActiveFilters={hasActiveFilters && !!filteredComponents}
                  onWiden={() => setScope('all')}
                />
              ) : (
                <>
                  {mfeItems.length > 0 && (
                    <Section label="Source MFEs" count={mfeItems.length}>
                      {mfeItems.map((item) => (
                        <ComboboxOption
                          key={itemKey(item)}
                          value={item}
                          className="cursor-pointer outline-none data-[focus]:bg-gray-50"
                        >
                          {({ focus }) => (
                            <MfeRow
                              mfe={(item as { kind: 'mfe-filter'; mfe: string; count: number }).mfe}
                              count={(item as { kind: 'mfe-filter'; mfe: string; count: number }).count}
                              focused={focus}
                            />
                          )}
                        </ComboboxOption>
                      ))}
                    </Section>
                  )}
                  {componentItems.length > 0 && (
                    <Section label={componentSectionLabel} count={componentItems.length}>
                      {componentItems.map((item) => (
                        <ComboboxOption
                          key={itemKey(item)}
                          value={item}
                          className="cursor-pointer outline-none data-[focus]:bg-gray-50"
                        >
                          {({ focus }) => (
                            <ComponentRow
                              c={(item as { kind: 'component'; component: GalleryComponent }).component}
                              focused={focus}
                            />
                          )}
                        </ComboboxOption>
                      ))}
                    </Section>
                  )}
                  {commandItems.length > 0 && (
                    <Section label={commandSectionLabel} count={commandItems.length}>
                      {commandItems.map((item) => (
                        <ComboboxOption
                          key={itemKey(item)}
                          value={item}
                          className="cursor-pointer outline-none data-[focus]:bg-gray-50"
                        >
                          {({ focus }) => (
                            <CommandRow
                              cmd={(item as { kind: 'command'; command: GalleryCommand }).command}
                              focused={focus}
                            />
                          )}
                        </ComboboxOption>
                      ))}
                    </Section>
                  )}
                </>
              )}
            </ComboboxOptions>

            {/* Footer hint legend */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> open / run
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>esc</Kbd> close
                </span>
              </div>
              {/* Scope chip — clickable to toggle, also shows ⌘⇧A keyboard shortcut. */}
              {hasActiveFilters && filteredComponents ? (
                <button
                  type="button"
                  onClick={() => setScope((s) => (s === 'filtered' ? 'all' : 'filtered'))}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="Toggle filter scope"
                >
                  {scope === 'filtered'
                    ? `Searching ${filteredComponents.length} of ${components.length} — search all`
                    : `Searching all ${components.length} — restrict to ${filteredComponents.length}`}
                  <Kbd>⌘</Kbd>
                  <Kbd>⇧</Kbd>
                  <Kbd>A</Kbd>
                </button>
              ) : (
                <span className="text-gray-400">
                  {hasQuery
                    ? `${totalResults} result${totalResults === 1 ? '' : 's'}`
                    : `${components.length} components · ${commands.length} commands`}
                </span>
              )}
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* MFE ranking — small enough to live alongside the palette                   */
/* -------------------------------------------------------------------------- */

interface MfeStat {
  mfe: string;
  count: number;
}

function rankMfes(
  stats: MfeStat[],
  query: string,
  limit: number,
): MfeStat[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const scored: Array<{ stat: MfeStat; score: number }> = [];
  for (const stat of stats) {
    const slug = stat.mfe.toLowerCase();
    let score = 0;
    if (slug === q) score = 1000;
    else if (slug.startsWith(q)) score = 500;
    else if (slug.includes(q)) score = 200;
    // Also match against the "second token" of the slug — "learning" should
    // surface "frontend-app-learning" without needing the "frontend-app-" prefix.
    else {
      const tokens = slug.split(/[-_]/).filter(Boolean);
      if (tokens.some((t) => t.startsWith(q))) score = 150;
      else if (tokens.some((t) => t.includes(q))) score = 80;
    }
    if (score > 0) scored.push({ stat, score });
  }
  scored.sort((a, b) => b.score - a.score || a.stat.mfe.localeCompare(b.stat.mfe));
  return scored.slice(0, limit).map((s) => s.stat);
}

/* -------------------------------------------------------------------------- */
/* Sub-pieces                                                                 */
/* -------------------------------------------------------------------------- */

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between px-4 pt-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <span className="font-mono text-[10px] text-gray-400">{count}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ComponentRow({
  c,
  focused,
}: {
  c: GalleryComponent;
  focused: boolean;
}) {
  const atomic = ATOMIC_LEVEL_META[c.atomicLevel];
  const status = STATUS_META[c.status];
  const initial = c.name
    .replace(/^Form\./, '')
    .replace(/^DataTable\./, '')
    .charAt(0);

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Thumbnail */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${atomic.gradient}`}
      >
        <span className="text-sm font-bold text-white/90">{initial}</span>
      </div>

      {/* Name + description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-mono text-sm font-semibold text-gray-900">
            {c.name}
          </span>
          <span
            className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide ${atomic.color}`}
          >
            {atomic.label}
          </span>
          {c.status !== 'stable' && (
            <span
              className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-medium ${status.color}`}
            >
              {status.label}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{c.description}</p>
      </div>

      {/* Meta — MFE + Enter hint on focus */}
      <div className="flex shrink-0 items-center gap-2 text-[10px]">
        <span className="font-mono text-gray-400">{c.sourceMfe}</span>
        {focused && <Kbd className="!h-4 !text-[9px]">↵</Kbd>}
      </div>
    </div>
  );
}

function CommandRow({
  cmd,
  focused,
}: {
  cmd: GalleryCommand;
  focused: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Glyph square — neutral palette, distinguishes commands from components at a glance */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-600">{cmd.glyph ?? '⌘'}</span>
      </div>

      {/* Label + description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-gray-900">
            {cmd.label}
          </span>
          <span className="shrink-0 rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-600">
            {cmd.group}
          </span>
        </div>
        {cmd.description && (
          <p className="truncate text-xs text-gray-500">{cmd.description}</p>
        )}
      </div>

      {/* Run hint on focus */}
      <div className="flex shrink-0 items-center gap-2 text-[10px]">
        {focused && <Kbd className="!h-4 !text-[9px]">↵</Kbd>}
      </div>
    </div>
  );
}

function MfeRow({
  mfe,
  count,
  focused,
}: {
  mfe: string;
  count: number;
  focused: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Source-repo glyph square — distinct emoji-style icon flags this as a filter action */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50">
        <span className="text-sm text-blue-700">📦</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-mono text-sm font-semibold text-gray-900">
            {mfe}
          </span>
          <span className="shrink-0 rounded bg-blue-50 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-blue-700">
            Filter source
          </span>
        </div>
        <p className="truncate text-xs text-gray-500">
          {count} component{count === 1 ? '' : 's'} from this source
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-[10px]">
        {focused && (
          <>
            <span className="text-gray-400">filter</span>
            <Kbd className="!h-4 !text-[9px]">↵</Kbd>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  query,
  total,
  scope,
  hasActiveFilters,
  onWiden,
}: {
  query: string;
  total: number;
  scope: Scope;
  hasActiveFilters: boolean;
  onWiden: () => void;
}) {
  if (!query) {
    return (
      <div className="px-4 py-8 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700">Start typing to search</p>
        <p className="mt-1">
          {total} components indexed, plus filter, view, and navigation commands.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 py-8 text-center text-xs text-gray-500">
      <p className="font-medium text-gray-700">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1">
        Try a shorter token, a category like &ldquo;form&rdquo;, or a command like
        &ldquo;deprecated&rdquo; or &ldquo;list view&rdquo;.
      </p>
      {scope === 'filtered' && hasActiveFilters && (
        <button
          type="button"
          onClick={onWiden}
          className="mt-3 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50"
        >
          Search all components
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>A</Kbd>
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
