'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Track whether a DOM element has ever entered the viewport.
 *
 * Returns `[ref, hasBeenInView]`. Attach the ref to the element whose
 * visibility you want to observe. Once the element scrolls into view (or is
 * already in view at mount), `hasBeenInView` flips to `true` and stays there
 * — we don't unset on scroll-away because expensive children (live previews,
 * lazy-imported subtrees) should not unmount and remount as the user
 * scrolls.
 *
 * Returns `false` during SSR; the IntersectionObserver only runs in the
 * browser, so server-rendered output never reflects the visible state.
 * This is intentional — keeping Paragon Form components (which generate
 * IDs from a module-level counter) out of the SSR tree avoids the
 * hydration mismatches tracked in #71.
 */
export function useInViewport<T extends Element>(
  options?: IntersectionObserverInit,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasBeenInView) return;

    // Fall back to "always in view" on browsers without IntersectionObserver
    // rather than leaving cards blank.
    if (typeof IntersectionObserver === 'undefined') {
      setHasBeenInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasBeenInView(true);
            observer.disconnect();
            return;
          }
        }
      },
      // Default to a generous rootMargin so we start rendering previews
      // slightly before they're actually visible — feels instant on scroll
      // rather than popping in.
      { rootMargin: '200px', ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBeenInView, options]);

  return [ref, hasBeenInView];
}
