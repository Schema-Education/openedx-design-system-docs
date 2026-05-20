'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GalleryComponent } from '@/lib/gallery';

const STORAGE_KEY = 'ods.palette.recent.v1';
const MAX_RECENT = 5;

/**
 * Tracks recently selected components in localStorage. The hook stores
 * an ordered list of `slug|sourceMfe` keys (a slug alone isn't unique
 * once MFE-level components join the registry) and hydrates them into
 * full GalleryComponent objects from the in-memory dataset on every
 * read.
 *
 * Returns an empty array on the server and during the first client
 * render to avoid hydration mismatches.
 */
export function useRecentSelections(components: GalleryComponent[]) {
  const [recentKeys, setRecentKeys] = useState<string[]>([]);

  // Hydrate after mount so the SSR HTML matches the first client paint.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentKeys(parsed.filter((s): s is string => typeof s === 'string'));
        }
      }
    } catch {
      // Corrupt storage; ignore.
    }
  }, []);

  const pushRecent = useCallback(
    (c: GalleryComponent) => {
      const key = makeKey(c);
      setRecentKeys((prev) => {
        const next = [key, ...prev.filter((k) => k !== key)].slice(0, MAX_RECENT);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Storage quota or privacy mode; recent will fall back to in-memory.
        }
        return next;
      });
    },
    [],
  );

  // Resolve keys to live component objects every render. If a key no longer
  // exists in the current dataset (component removed by the crawler), we drop it.
  const byKey = new Map<string, GalleryComponent>();
  for (const c of components) byKey.set(makeKey(c), c);
  const recent = recentKeys
    .map((k) => byKey.get(k))
    .filter((c): c is GalleryComponent => Boolean(c));

  return { recent, pushRecent };
}

function makeKey(c: GalleryComponent): string {
  return `${c.sourceMfe}|${c.slug}`;
}
