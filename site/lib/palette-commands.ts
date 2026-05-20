/**
 * Command palette — non-component commands (PR 2 / 3).
 *
 * The palette can search and run **commands** alongside components.
 * Commands mutate gallery state (filters, group-by, view mode) or open
 * external URLs. Each command has:
 *   - `id`         — stable string used for keys + recent tracking
 *   - `label`      — what the user sees and what we rank against
 *   - `keywords[]` — extra search hay so e.g. "list" finds "Switch to list view"
 *   - `group`      — section header in the palette
 *   - `perform()`  — what runs when the user hits Enter
 *
 * The exported `buildCommands(ctx)` factory produces the full list given the
 * current gallery state + setters. Recomputed on every gallery render so
 * conditional commands (e.g. "Clear all filters") only appear when relevant.
 *
 * Ranking is intentionally simpler than rankComponents — labels are short
 * and keyword-matching is enough at this scale.
 */

import type { AtomicLevel } from './registry';
import { ATOMIC_LEVEL_META, type GroupBy } from './gallery';

export type CommandGroup = 'Filters' | 'View' | 'Navigation';

export interface GalleryCommand {
  id: string;
  label: string;
  description?: string;
  group: CommandGroup;
  keywords: string[];
  /** Optional one-letter glyph rendered as the command's icon-square. */
  glyph?: string;
  perform: () => void;
}

export type ActiveLevel = 'all' | AtomicLevel;
export type ViewMode = 'card' | 'list';

export interface CommandContext {
  // Current state — used to decide which conditional commands to surface
  activeLevel: ActiveLevel;
  groupBy: GroupBy;
  viewMode: ViewMode;
  deprecatedVisible: boolean;
  hasActiveFilters: boolean;

  // Setters
  setActiveLevel: (l: ActiveLevel) => void;
  setGroupBy: (g: GroupBy) => void;
  setViewMode: (v: ViewMode) => void;
  toggleDeprecated: () => void;
  clearAllFilters: () => void;
}

/**
 * Build the full command list from current gallery state + setters.
 *
 * Order matters — items appear in the empty-state "Suggested" surface in
 * declaration order, so the most frequently-useful actions come first.
 */
export function buildCommands(ctx: CommandContext): GalleryCommand[] {
  const cmds: GalleryCommand[] = [];

  // --- Filters --------------------------------------------------------------

  if (ctx.hasActiveFilters) {
    cmds.push({
      id: 'filters/clear-all',
      label: 'Clear all filters',
      description: 'Reset categories, sources, and search',
      group: 'Filters',
      keywords: ['reset', 'clear', 'all', 'filters'],
      glyph: '⊘',
      perform: ctx.clearAllFilters,
    });
  }

  cmds.push({
    id: 'filters/deprecated',
    label: ctx.deprecatedVisible ? 'Hide deprecated components' : 'Show deprecated components',
    description: ctx.deprecatedVisible
      ? 'Filter deprecated components out of the gallery'
      : 'Surface deprecated components in their groups',
    group: 'Filters',
    keywords: ['deprecated', 'legacy', 'hide', 'show', 'status'],
    glyph: ctx.deprecatedVisible ? '◌' : '◍',
    perform: ctx.toggleDeprecated,
  });

  // Per-level focus filters — one per atomic level.
  (['atom', 'molecule', 'organism', 'template', 'page'] as AtomicLevel[]).forEach((lvl) => {
    if (ctx.activeLevel === lvl) return; // already focused — skip
    const meta = ATOMIC_LEVEL_META[lvl];
    cmds.push({
      id: `filters/level/${lvl}`,
      label: `Show ${meta.label}s only`,
      description: `Focus the gallery on ${meta.label.toLowerCase()}-level components`,
      group: 'Filters',
      keywords: ['filter', 'level', lvl, meta.label.toLowerCase(), 'atomic'],
      glyph: '◆',
      perform: () => ctx.setActiveLevel(lvl),
    });
  });

  if (ctx.activeLevel !== 'all') {
    cmds.push({
      id: 'filters/level/all',
      label: 'Show all atomic levels',
      description: 'Clear the atomic-level tab focus',
      group: 'Filters',
      keywords: ['all', 'clear', 'level', 'atomic'],
      glyph: '∞',
      perform: () => ctx.setActiveLevel('all'),
    });
  }

  // --- View -----------------------------------------------------------------

  const groupByOptions: Array<{ value: GroupBy; label: string; keywords: string[] }> = [
    { value: 'atomicLevel', label: 'Atomic Level', keywords: ['atomic', 'level', 'atoms', 'molecules'] },
    { value: 'functionalCategory', label: 'Functional Category', keywords: ['functional', 'category', 'action', 'input'] },
    { value: 'sourceMfe', label: 'Source MFE', keywords: ['source', 'mfe', 'repo', 'package'] },
    { value: 'flat', label: 'Flat (alphabetical)', keywords: ['flat', 'alphabetical', 'az', 'unsorted'] },
  ];
  groupByOptions.forEach((opt) => {
    if (ctx.groupBy === opt.value) return;
    cmds.push({
      id: `view/group-by/${opt.value}`,
      label: `Group by ${opt.label}`,
      description: 'Change how cards are grouped on the page',
      group: 'View',
      keywords: ['group', 'by', ...opt.keywords],
      glyph: '⊞',
      perform: () => ctx.setGroupBy(opt.value),
    });
  });

  if (ctx.viewMode !== 'card') {
    cmds.push({
      id: 'view/mode/card',
      label: 'Switch to card view',
      description: 'Show components as a card grid',
      group: 'View',
      keywords: ['card', 'grid', 'view', 'thumbnail'],
      glyph: '▦',
      perform: () => ctx.setViewMode('card'),
    });
  }
  if (ctx.viewMode !== 'list') {
    cmds.push({
      id: 'view/mode/list',
      label: 'Switch to list view',
      description: 'Show components as a dense list',
      group: 'View',
      keywords: ['list', 'rows', 'dense', 'view'],
      glyph: '☰',
      perform: () => ctx.setViewMode('list'),
    });
  }

  // --- Navigation -----------------------------------------------------------

  cmds.push(
    {
      id: 'nav/paragon-repo',
      label: 'Open Paragon repo',
      description: 'github.com/openedx/paragon',
      group: 'Navigation',
      keywords: ['paragon', 'github', 'repo', 'source'],
      glyph: '↗',
      perform: () => window.open('https://github.com/openedx/paragon', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'nav/vision',
      label: 'Read product vision',
      description: 'Open the design-system product vision document',
      group: 'Navigation',
      keywords: ['vision', 'docs', 'roadmap', 'product'],
      glyph: '↗',
      perform: () =>
        window.open(
          'https://github.com/Schema-Education/openedx-design-system-docs/blob/main/vision/product-vision.mdx',
          '_blank',
          'noopener,noreferrer',
        ),
    },
    {
      id: 'nav/rfc-0001',
      label: 'Open ODS-RFC-0001',
      description: 'MFE Component Registry RFC',
      group: 'Navigation',
      keywords: ['rfc', 'proposal', '0001', 'registry'],
      glyph: '↗',
      perform: () =>
        window.open(
          'https://github.com/Schema-Education/openedx-design-system-docs/blob/main/proposals/0001-mfe-component-registry.md',
          '_blank',
          'noopener,noreferrer',
        ),
    },
    {
      id: 'nav/docs',
      label: 'Go to docs',
      description: 'Open the docs landing page',
      group: 'Navigation',
      keywords: ['docs', 'documentation', 'home'],
      glyph: '→',
      perform: () => {
        window.location.href = '/docs';
      },
    },
    {
      id: 'nav/home',
      label: 'Go to home',
      description: 'Open the design-system landing page',
      group: 'Navigation',
      keywords: ['home', 'landing', 'index'],
      glyph: '→',
      perform: () => {
        window.location.href = '/';
      },
    },
  );

  return cmds;
}

/* -------------------------------------------------------------------------- */
/* Ranking                                                                    */
/* -------------------------------------------------------------------------- */

const COMMAND_SCORES = {
  exactLabel: 1000,
  labelPrefix: 500,
  labelContains: 200,
  keywordExact: 150,
  keywordPrefix: 80,
  keywordContains: 40,
  descriptionContains: 30,
} as const;

export function scoreCommand(cmd: GalleryCommand, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const label = cmd.label.toLowerCase();
  const desc = (cmd.description ?? '').toLowerCase();

  let score = 0;

  if (label === q) score += COMMAND_SCORES.exactLabel;
  else if (label.startsWith(q)) score += COMMAND_SCORES.labelPrefix;
  else if (label.includes(q)) score += COMMAND_SCORES.labelContains;

  for (const kw of cmd.keywords) {
    const k = kw.toLowerCase();
    if (k === q) {
      score += COMMAND_SCORES.keywordExact;
      break;
    } else if (k.startsWith(q)) {
      score += COMMAND_SCORES.keywordPrefix;
    } else if (k.includes(q)) {
      score += COMMAND_SCORES.keywordContains;
    }
  }

  if (desc.includes(q)) score += COMMAND_SCORES.descriptionContains;

  return score;
}

export function rankCommands(
  commands: GalleryCommand[],
  query: string,
  limit = 6,
): GalleryCommand[] {
  if (!query.trim()) return [];
  const scored: Array<{ cmd: GalleryCommand; score: number }> = [];
  for (const cmd of commands) {
    const s = scoreCommand(cmd, query);
    if (s > 0) scored.push({ cmd, score: s });
  }
  scored.sort((a, b) => b.score - a.score || a.cmd.label.localeCompare(b.cmd.label));
  return scored.slice(0, limit).map((s) => s.cmd);
}

/**
 * Top-N suggested commands for the empty-state surface.
 * Picks one representative command per group, then fills with declaration
 * order. Limited to 4 so it doesn't drown out Recent components.
 */
export function suggestedCommands(commands: GalleryCommand[], limit = 4): GalleryCommand[] {
  if (commands.length === 0) return [];
  const seen = new Set<CommandGroup>();
  const picks: GalleryCommand[] = [];
  // First pass: one per group.
  for (const cmd of commands) {
    if (seen.has(cmd.group)) continue;
    seen.add(cmd.group);
    picks.push(cmd);
    if (picks.length >= limit) return picks;
  }
  // Fill remaining slots with declaration order.
  for (const cmd of commands) {
    if (picks.length >= limit) break;
    if (!picks.includes(cmd)) picks.push(cmd);
  }
  return picks;
}
