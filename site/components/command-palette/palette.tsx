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
  components: GalleryComponent[];
  /** Commands surfaced alongside components — see lib/palette-commands. */
  commands: GalleryCommand[];
  open: boolean;
  onClose: () => void;
  onSelectComponent: (c: GalleryComponent) => void;
}

/**
 * Global ⌘K command palette — PR 2 / 3.
 *
 * Scope of this PR (additions over PR 1):
 * - Renders **commands** (filter / view / navigation actions) alongside
 *   components in a single keyboard-navigable list
 * - Empty state shows Recent components + Suggested commands
 * - Component AND command results coexist when a query matches both
 *
 * Out of scope (PR 3): filter-first scope toggle + Source MFE quick-jump.
 */

type PaletteItem =
  | { kind: 'component'; component: GalleryComponent }
  | { kind: 'command'; command: GalleryCommand };

function itemKey(item: PaletteItem): string {
  return item.kind === 'component'
    ? `c:${item.component.sourceMfe}|${item.component.slug}`
    : `k:${item.command.id}`;
}

export function CommandPalette({
  components,
  commands,
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

  const rankedComponents = useMemo(
    () => rankComponents(components, query, 8).map((r) => r.component),
    [components, query],
  );
  const rankedCommandList = useMemo(
    () => rankCommands(commands, query, 6),
    [commands, query],
  );
  const suggested = useMemo(() => suggestedCommands(commands, 4), [commands]);

  const hasQuery = query.trim().length > 0;

  const componentItems: PaletteItem[] = (hasQuery ? rankedComponents : recent).map(
    (c) => ({ kind: 'component', component: c }),
  );
  const commandItems: PaletteItem[] = (hasQuery ? rankedCommandList : suggested).map(
    (cmd) => ({ kind: 'command', command: cmd }),
  );

  const componentSectionLabel = hasQuery ? 'Components' : 'Recent';
  const commandSectionLabel = hasQuery ? 'Commands' : 'Suggested';

  const totalResults = componentItems.length + commandItems.length;

  function handleSelect(item: PaletteItem | null) {
    if (!item) return;
    if (item.kind === 'component') {
      pushRecent(item.component);
      onSelectComponent(item.component);
    } else {
      item.command.perform();
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      aria-label={`Search ${components.length} components and ${commands.length} commands`}
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
                  hasQuery
                    ? 'Search components and commands…'
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
                <EmptyState query={query} total={components.length} />
              ) : (
                <>
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
              <span className="text-gray-400">
                {hasQuery
                  ? `${totalResults} result${totalResults === 1 ? '' : 's'}`
                  : `${components.length} components · ${commands.length} commands`}
              </span>
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
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

function EmptyState({ query, total }: { query: string; total: number }) {
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
