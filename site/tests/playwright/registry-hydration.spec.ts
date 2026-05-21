/**
 * Catch-all hydration regression test for /registry.
 *
 * Independent of the per-card walk: loads the flat-view grid cold,
 * scrolls all the way to the bottom of the grid (forcing every
 * IntersectionObserver-gated preview to mount), and fails if ANY console
 * error or page error occurs during the page lifetime — hydration,
 * preview mount, or otherwise.
 *
 * This is the broad safety net. If a new component preview lands that
 * throws on mount, this test should be the first to flag it before the
 * per-card spec even runs (test files are alphabetized by default).
 */

import { expect, test } from '@playwright/test';
import { attachPageInstruments } from './helpers/page-instruments';

test.describe('Registry full-scroll hydration', () => {
  test('no console errors or pageerrors after scrolling every preview into view', async ({
    page,
  }) => {
    const instruments = attachPageInstruments(page);

    await page.goto('/registry', { waitUntil: 'domcontentloaded' });

    // Switch to flat view for predictable scrolling — grouped view
    // collapses some sections off-screen but still mounts cards, so this
    // is purely a "make the report deterministic" choice rather than a
    // coverage one.
    await page.getByRole('button', { name: /Group by/ }).click();
    await page.getByRole('option', { name: 'Flat (A-Z)' }).click();

    // Bottom-stop sentinel: once the registry grid has rendered all
    // cards, the "Showing X of Y components" counter stabilizes and the
    // last visible card we see should be at/near the alphabetical tail.
    // Rather than trying to be clever about that, we just scroll the
    // window in 800px increments until scroll position stops growing.
    await scrollToBottom(page);

    // Let any final lazy previews finish mounting + log any errors they
    // raise. 750ms is a comfortable buffer that doesn't slow the test
    // dramatically.
    await page.waitForTimeout(750);

    const snap = instruments.snapshot();
    expect(
      snap.pageErrors,
      `pageerrors during hydration / preview mount:\n  - ${snap.pageErrors.join('\n  - ')}`,
    ).toEqual([]);
    expect(
      snap.consoleErrors,
      `console errors during hydration / preview mount:\n  - ${snap.consoleErrors.join('\n  - ')}`,
    ).toEqual([]);
  });
});

async function scrollToBottom(page: import('@playwright/test').Page): Promise<void> {
  let lastY = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => {
      window.scrollBy(0, 800);
      return window.scrollY + window.innerHeight;
    });
    if (y === lastY) break;
    lastY = y;
    await page.waitForTimeout(120);
  }
}
