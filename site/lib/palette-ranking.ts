/**
 * Pure ranking function for the ⌘K command palette.
 *
 * Hand-rolled — no fuzzy library — because the dataset is small
 * (≤ a few hundred components) and we want zero new bundle weight
 * plus deterministic, debuggable scoring.
 *
 * See site/components/command-palette/palette.tsx for the consumer.
 */

import type { GalleryComponent } from './gallery';
import { ATOMIC_LEVEL_META } from './gallery';

export interface RankedResult {
  component: GalleryComponent;
  score: number;
}

const SCORES = {
  exactName: 1000,
  namePrefix: 500,
  nameContains: 200,
  nameTokenPrefix: 150,
  descriptionPrefix: 80,
  descriptionContains: 40,
  categoryContains: 30,
  sourceMfeContains: 25,
  consumersContains: 20,
  atomicLevelMatch: 10,
  stableBoost: 5,
  deprecatedPenalty: -50,
} as const;

/**
 * Score a single component against a normalized lowercase query.
 * Returns 0 if no signal at all — caller filters those out.
 */
export function scoreComponent(
  c: GalleryComponent,
  query: string,
): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const name = c.name.toLowerCase();
  const desc = c.description.toLowerCase();
  const cat = c.functionalCategory.toLowerCase();
  const mfe = c.sourceMfe.toLowerCase();
  const level = c.atomicLevel.toLowerCase();

  let score = 0;

  if (name === q) score += SCORES.exactName;
  else if (name.startsWith(q)) score += SCORES.namePrefix;
  else if (name.includes(q)) score += SCORES.nameContains;
  else {
    // Token-prefix: split on dots / camelCase boundaries, then check
    // whether any token starts with the query (e.g. `dat` → `DataTable`).
    const tokens = c.name
      .replace(/\./g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.some((t) => t.startsWith(q))) {
      score += SCORES.nameTokenPrefix;
    }
  }

  if (desc.startsWith(q)) score += SCORES.descriptionPrefix;
  else if (desc.includes(q)) score += SCORES.descriptionContains;

  if (cat.includes(q)) score += SCORES.categoryContains;
  if (mfe.includes(q)) score += SCORES.sourceMfeContains;

  if (c.consumers.some((cn) => cn.toLowerCase().includes(q))) {
    score += SCORES.consumersContains;
  }

  if (level === q) score += SCORES.atomicLevelMatch;

  if (score === 0) return 0;

  if (c.status === 'stable') score += SCORES.stableBoost;
  if (c.status === 'deprecated') score += SCORES.deprecatedPenalty;

  return score;
}

/**
 * Rank a list of components against a query and return results sorted
 * by descending score. Ties broken first by atomic-level order
 * (atoms before molecules, etc.), then alphabetically by name.
 *
 * Pass `limit` to cap output (default 8 — palette UI shows a max of
 * eight components before scrolling).
 */
export function rankComponents(
  components: GalleryComponent[],
  query: string,
  limit = 8,
): RankedResult[] {
  if (!query.trim()) return [];

  const scored: RankedResult[] = [];
  for (const c of components) {
    const score = scoreComponent(c, query);
    if (score > 0) scored.push({ component: c, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const lvlDelta =
      ATOMIC_LEVEL_META[a.component.atomicLevel].order -
      ATOMIC_LEVEL_META[b.component.atomicLevel].order;
    if (lvlDelta !== 0) return lvlDelta;
    return a.component.name.localeCompare(b.component.name);
  });

  return scored.slice(0, limit);
}
