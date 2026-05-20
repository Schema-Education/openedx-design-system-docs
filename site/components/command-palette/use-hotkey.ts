'use client';

import { useEffect } from 'react';

/**
 * Binds ⌘K / Ctrl+K (and the legacy ⌘/ binding GitHub popularised) to
 * a toggle callback. `event.preventDefault` is called so the browser's
 * built-in shortcuts don't interfere.
 *
 * The handler is registered on `window` rather than inside any single
 * component so the binding works no matter where focus is — including
 * when focus is inside an `<input>` elsewhere on the page (filter chips,
 * inline search, etc.).
 */
export function usePaletteHotkey(onToggle: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key === 'k' || e.key === 'K' || e.key === '/') {
        e.preventDefault();
        onToggle();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onToggle]);
}
