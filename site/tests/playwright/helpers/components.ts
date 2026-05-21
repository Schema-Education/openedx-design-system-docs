/**
 * Discover the set of registry components that have a registered Paragon
 * preview — this is what the regression suite walks.
 *
 * We intentionally derive the test list from two sources of truth and
 * intersect them:
 *
 *   1. `lib/components.json` — the registry metadata that drives the
 *      gallery (search, filtering, grouping, card titles).
 *   2. `components/previews/index.ts` (via the per-bucket exports) — the
 *      lookup table the card uses to pick a live Paragon subtree. A card
 *      only ships interactive content when an entry exists here.
 *
 * The intersection guarantees:
 *   - We test every card whose preview *can* render Paragon (i.e. the
 *     ones with the real regression risk — the failures behind #72, #75,
 *     #78, etc., were all Paragon-preview-driven).
 *   - We don't waste time on registry rows whose preview is the static
 *     gradient placeholder — those can't fail in the ways we care about.
 *
 * Pulling from these files at test-collection time means the suite grows
 * automatically when new previews land. No manual list to maintain.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

// Playwright runs the test files via tsx in CJS mode (no "type":"module"
// in site/package.json), so `__dirname` is available without polyfilling
// from `import.meta.url`. The site root is two levels up from
// `tests/playwright/helpers`.
const SITE_ROOT = path.resolve(__dirname, '..', '..', '..');

export interface RegistryComponent {
  slug: string;
  name: string;
  sourceMfe: string;
  atomicLevel: string;
  status: string;
  functionalCategory: string;
}

/**
 * Parse the keys defined in a previews/*.tsx file. We don't run the TSX
 * (it pulls in React + Paragon); we just look for the top-level keys of
 * each `Record<string, () => ReactNode>` export. The structure is stable:
 * each entry starts at column 2 with `<PascalIdentifier>:`.
 */
function extractPreviewKeys(filePath: string): string[] {
  const src = readFileSync(filePath, 'utf8');
  const keys = new Set<string>();
  // Match lines like "  Badge: () =>" or "  Form: () => (".
  // Allows dotted identifiers (e.g. Form.Switch) for forward compatibility
  // even though current previews are flat names.
  const lineRe = /^\s{2}([A-Z][A-Za-z0-9.]*):\s*\(\)\s*=>/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(src)) !== null) {
    keys.add(m[1]);
  }
  return Array.from(keys);
}

let cachedPreviewKeys: Set<string> | null = null;

export function getPreviewKeys(): Set<string> {
  if (cachedPreviewKeys) return cachedPreviewKeys;
  const previewDir = path.join(SITE_ROOT, 'components', 'previews');
  const files = [
    'atoms.tsx',
    'molecules.tsx',
    'organisms.tsx',
    'data-table.tsx',
    'overlays.tsx',
    'layout.tsx',
    'extras.tsx',
  ];
  const all = new Set<string>();
  for (const f of files) {
    for (const k of extractPreviewKeys(path.join(previewDir, f))) {
      all.add(k);
    }
  }
  cachedPreviewKeys = all;
  return all;
}

let cachedComponents: RegistryComponent[] | null = null;

export function loadAllComponents(): RegistryComponent[] {
  if (cachedComponents) return cachedComponents;
  const raw = readFileSync(path.join(SITE_ROOT, 'lib', 'components.json'), 'utf8');
  cachedComponents = JSON.parse(raw) as RegistryComponent[];
  return cachedComponents;
}

/**
 * The list of components the suite will walk. Filters to:
 *   - `sourceMfe === 'paragon'` (we only render live Paragon subtrees;
 *     MFE components currently fall back to the placeholder anyway).
 *   - A preview key is registered for the component name.
 *   - Not deprecated (the gallery defaults to hiding deprecated cards,
 *     so they're not in the DOM on a cold load and can't be clicked.
 *     The user-facing surface area is exactly the stable + experimental
 *     set, so that's what we test).
 *
 * Sorted alphabetically for deterministic test ordering and stable report
 * output.
 */
export function getTestableComponents(): RegistryComponent[] {
  const previews = getPreviewKeys();
  const list = loadAllComponents()
    .filter((c) => c.sourceMfe === 'paragon')
    .filter((c) => previews.has(c.name))
    .filter((c) => c.status !== 'deprecated')
    .sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
