/**
 * Loose performance budget for /registry.
 *
 * Goal: catch catastrophic regressions, not micro-noise. If FCP balloons
 * from sub-second to multi-second, something broke. The threshold is
 * deliberately generous.
 *
 * Modes:
 *   - prod (default in CI):  budget = 200ms.
 *   - dev:                    budget = 500ms.
 *
 * Dev mode is much slower because Turbopack compiles on demand; CI
 * should usually run this against `pnpm build && pnpm start`. Skip the
 * test entirely if FCP isn't observable (some browsers may not expose
 * paint timing for the first navigation in headless mode).
 */

import { expect, test } from '@playwright/test';

const IS_PROD = process.env.PLAYWRIGHT_PROD === '1';
const FCP_BUDGET_MS = IS_PROD ? 200 : 500;

test.describe('Registry performance budget', () => {
  test('first contentful paint stays within budget', async ({ page }) => {
    await page.goto('/registry', { waitUntil: 'networkidle' });

    // performance.getEntriesByType('paint') returns 'first-paint' and
    // 'first-contentful-paint' entries (in browsers that support them).
    const fcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint') as PerformanceEntry[];
      const e = entries.find((x) => x.name === 'first-contentful-paint');
      return e ? e.startTime : null;
    });

    test.skip(
      fcp == null,
      'first-contentful-paint not observable in this browser context',
    );

    expect(
      fcp,
      `first-contentful-paint = ${fcp?.toFixed(0)}ms (budget ${FCP_BUDGET_MS}ms, mode=${
        IS_PROD ? 'prod' : 'dev'
      })`,
    ).toBeLessThan(FCP_BUDGET_MS);
  });
});
