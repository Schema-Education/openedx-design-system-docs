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
import { useRecentSelections } from './use-recent';

interface CommandPaletteProps {
  components: GalleryComponent[];
  open: boolean;
  onClose: () => void;
  onSelectComponent: (c: GalleryComponent) => void;
}

/**
 * Global ⌘K command palette — PR 1 / 3.
 *
 * Scope of this PR:
 * - Open/close via ⌘K / Ctrl+K / Esc
 * - Type-to-filter components, ranked by lib/palette-ranking
 * - Empty-state shows up to 5 recent selections from localStorage
 * - Selecting a component delegates to `onSelectComponent` (which is
 *   wired to gallery.selectComponent — opens the existing detail pane)
 *
 * Out of scope (PR 2): non-component "commands" (filter actions, view
 * toggles, external links).
 * Out of scope (PR 3): filter-first scope toggle + Source MFE quick-jump.
 */
export function CommandPalette({
  components,
  open,
  onClose,
  onSelectComponent,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const { recent, pushRecent } = useRecentSelections(components);

  // Reset query whenever the dialog opens so the user lands on a clean slate.
  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const ranked = useMemo(
    () => rankComponents(components, query, 8),
    [components, query],
  );

  // When the input is empty, show recent selections; otherwise show ranked results.
  const visible: GalleryComponent[] = query.trim()
    ? ranked.map((r) => r.component)
    : recent;

  function handleSelect(c: GalleryComponent | null) {
    if (!c) return;
    pushRecent(c);
    onSelectComponent(c);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      aria-label={`Search ${components.length} components`}
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
          <Combobox<GalleryComponent | null>
            onChange={handleSelect}
            // We only ever set `value` to null — selecting a component
            // closes the dialog and shouldn't leave it "checked".
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
                  query
                    ? 'Search components…'
                    : 'Search components — try "Card", "frontend-app-learning", or "atom"'
                }
                className="flex-1 border-0 bg-transparent py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
                aria-label="Search components"
              />
              <Kbd>esc</Kbd>
            </div>

            {/* Results / empty state */}
            <ComboboxOptions
              static
              className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto"
            >
              {visible.length > 0 ? (
                <Section
                  label={query ? 'Components' : 'Recent'}
                  count={visible.length}
                >
                  {visible.map((c) => (
                    <ComboboxOption
                      key={`${c.sourceMfe}-${c.slug}`}
                      value={c}
                      className="cursor-pointer outline-none data-[focus]:bg-gray-50"
                    >
                      {({ focus }) => <ResultRow c={c} focused={focus} />}
                    </ComboboxOption>
                  ))}
                </Section>
              ) : (
                <EmptyState query={query} total={components.length} />
              )}
            </ComboboxOptions>

            {/* Footer hint legend */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> open
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>esc</Kbd> close
                </span>
              </div>
              <span className="text-gray-400">
                {query
                  ? `${visible.length} result${visible.length === 1 ? '' : 's'}`
                  : `${components.length} components indexed`}
              </span>
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-pieces — kept in this file for PR 1 to minimise file churn; split out  */
/* if/when PR 2 adds a second result type (Commands).                          */
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

function ResultRow({
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
        {focused && (
          <Kbd className="!h-4 !text-[9px]">↵</Kbd>
        )}
      </div>
    </div>
  );
}

function EmptyState({ query, total }: { query: string; total: number }) {
  if (!query) {
    return (
      <div className="px-4 py-8 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700">Start typing to search</p>
        <p className="mt-1">
          {total} components indexed across Paragon and the MFE ecosystem.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 py-8 text-center text-xs text-gray-500">
      <p className="font-medium text-gray-700">
        No components match &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1">Try a shorter token or a category like &ldquo;form&rdquo;.</p>
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
