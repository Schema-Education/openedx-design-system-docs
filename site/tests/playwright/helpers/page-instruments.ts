/**
 * Per-page collectors for the four categories of failure we care about:
 *
 *   - Uncaught page errors (rejections from React render, etc.)
 *   - `console.error` messages (React hydration warnings, prop type
 *     errors, the AvatarButton "[object Object]" warning, etc.)
 *   - 4xx/5xx network responses from same-origin requests (catches the
 *     /[object Object] 404 from AvatarButton #72 — that bug emitted both
 *     a console warning AND a 404 for the asset, so the network channel
 *     is the redundant safety net).
 *   - Render-blocking failures by way of timeouts, captured by the test
 *     itself.
 *
 * The collectors attach to a single `page` instance; tests should call
 * `attachPageInstruments(page)` once during setup and read `.snapshot()`
 * before asserting.
 */

import type { Page } from '@playwright/test';

export interface NetworkError {
  url: string;
  status: number;
  resourceType: string;
}

export interface PageInstruments {
  page: Page;
  consoleErrors: string[];
  pageErrors: string[];
  networkErrors: NetworkError[];
  /** Clear all buffers (use between sub-cases inside a single test). */
  reset(): void;
  /** Return a stable snapshot (copy) of all buffered diagnostics. */
  snapshot(): {
    consoleErrors: string[];
    pageErrors: string[];
    networkErrors: NetworkError[];
  };
}

/**
 * Known-noisy console.error patterns from third-party libs / dev tooling
 * that aren't regressions we control. Anything matched here is dropped
 * before failing the test.
 *
 * Keep this list TIGHT — each entry should be a known false-positive.
 * When in doubt, leave the noise visible so the next failure surfaces it.
 */
const CONSOLE_NOISE_PATTERNS: RegExp[] = [
  // Source map fetch failures from Next.js in dev mode — not actionable.
  /Failed to parse source map/i,
  // Webpack HMR connection chatter — flaky on slow CI, not a regression.
  /\[HMR\]/i,
  // React DevTools recommendation banner.
  /Download the React DevTools/i,
  // Next.js's prerender-skipping diagnostic for client-only pages.
  /Skipping auto-scroll behavior/i,
];

function isNoise(msg: string): boolean {
  return CONSOLE_NOISE_PATTERNS.some((re) => re.test(msg));
}

/**
 * Should we count a 4xx/5xx response as a regression?
 *
 *   - Same-origin: yes (this is what we're trying to catch — #72's
 *     `/[object Object]` 404 for AvatarButton was a same-origin asset
 *     fetch.)
 *   - Offsite (e.g. github.com/openedx/paragon repo metadata fetches the
 *     site occasionally makes): no — those are outside our control.
 *   - The `__nextjs_original-stack-frames` endpoint frequently 404s in
 *     dev mode when source maps are missing; that's noise.
 */
function isSameOriginFailure(
  url: string,
  status: number,
  baseUrl: string,
): boolean {
  if (status < 400) return false;
  try {
    const u = new URL(url);
    const base = new URL(baseUrl);
    if (u.origin !== base.origin) return false;
  } catch {
    return false;
  }
  if (url.includes('__nextjs_original-stack-frames')) return false;
  if (url.includes('/_next/static/chunks/pages-')) {
    // App-router build has no pages/ chunks; spurious 404 in dev.
    return false;
  }
  return true;
}

export function attachPageInstruments(page: Page): PageInstruments {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkErrors: NetworkError[] = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isNoise(text)) return;
    consoleErrors.push(text);
  });

  page.on('pageerror', (err) => {
    pageErrors.push(`${err.name}: ${err.message}`);
  });

  page.on('response', (res) => {
    const status = res.status();
    const url = res.url();
    if (!isSameOriginFailure(url, status, page.url() || res.frame().url())) {
      return;
    }
    networkErrors.push({
      url,
      status,
      resourceType: res.request().resourceType(),
    });
  });

  return {
    page,
    consoleErrors,
    pageErrors,
    networkErrors,
    reset() {
      consoleErrors.length = 0;
      pageErrors.length = 0;
      networkErrors.length = 0;
    },
    snapshot() {
      return {
        consoleErrors: [...consoleErrors],
        pageErrors: [...pageErrors],
        networkErrors: [...networkErrors],
      };
    },
  };
}
