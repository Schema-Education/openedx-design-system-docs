/**
 * Per-card regression coverage for /registry preview interactions.
 *
 * For every component that has a registered Paragon preview, this spec:
 *
 *   1. Loads /registry.
 *   2. Switches Group-by to "Flat (A-Z)" — deterministic ordering and a
 *      single contiguous grid makes it cheap to locate a specific card.
 *   3. Types the component name into the search input — filters the grid
 *      down to the one card we care about (cheapest way to surface it).
 *   4. Scrolls the card into view so the IntersectionObserver gate from
 *      #75 mounts the live Paragon subtree (preview-frame.tsx /
 *      use-in-viewport.ts).
 *   5. Clicks the card title button to open the detail pane.
 *   6. Asserts the pane opened (the detail-pane tablist with the four
 *      `role="tab"` buttons is the most stable DOM checkpoint).
 *   7. Closes the pane via Escape.
 *   8. Reports per-card diagnostics into the aggregate JSON.
 *
 * The aggregate report (test-results/registry-coverage.json) records:
 *   - pass/fail
 *   - per-card console / page / network errors
 *   - click → detail-pane-visible elapsed ms
 *
 * Reviewer workflow: open the JSON, sort by `passed:false`, and review
 * the failure reasons. Specific bugs (#72, #75/#80, #78, #77, #71)
 * surface here as the literal text of the captured error.
 */

import { expect, test } from '@playwright/test';
import { getTestableComponents } from './helpers/components';
import { attachPageInstruments } from './helpers/page-instruments';
import { recordCard } from './helpers/report';

const COMPONENTS = getTestableComponents();

test.describe('Registry card regression coverage', () => {
  // Sanity check — the discovery helper found components. If this trips
  // it means components.json was empty / the preview parser regressed.
  test('component discovery returned at least 50 paragon components', () => {
    expect(COMPONENTS.length).toBeGreaterThanOrEqual(50);
  });

  for (const component of COMPONENTS) {
    test(`renders & opens detail for ${component.name}`, async ({ page }) => {
      const instruments = attachPageInstruments(page);
      const failureReasons: string[] = [];
      let clickToDetailMs: number | null = null;
      let passed = true;

      try {
        await page.goto('/registry', { waitUntil: 'domcontentloaded' });

        // Switch Group-by to "Flat (A-Z)". The Group-by control is a
        // headlessui Listbox — clicking the trigger opens an options
        // panel; we then click the "Flat (A-Z)" option by text.
        const groupByTrigger = page.getByRole('button', { name: /Group by/ });
        await groupByTrigger.click();
        await page.getByRole('option', { name: 'Flat (A-Z)' }).click();

        // Filter the grid down via the search input.
        const search = page.getByPlaceholder('Search components');
        await search.fill(component.name);

        // The card has the component name in an h3 (mono font) with a
        // <button> child that opens the detail pane. The button text
        // exactly matches `component.name`, but multiple cards can share
        // a prefix (e.g. "Form" vs "FormControl"), so pull all matches
        // and select the exact-text one.
        const cardButton = page
          .locator('h3 button', { hasText: new RegExp(`^${escapeRegex(component.name)}$`) })
          .first();
        await expect(cardButton).toBeVisible({ timeout: 15_000 });

        // Scroll the card into view to trigger IntersectionObserver mount
        // of the live Paragon subtree. We give it a beat to settle so any
        // hydration / preview-mount errors land in the console buffer
        // before we click.
        await cardButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);

        const clickedAt = Date.now();
        await cardButton.click();

        // The detail pane has an aside with `aria-label="${name} details"`.
        // That's the most specific check we can write; falls back to a
        // generic tablist match if the label is missing for any reason.
        const detailAside = page.locator(
          `aside[aria-label="${component.name} details"]`,
        );
        await expect(detailAside).toBeVisible({ timeout: 15_000 });
        clickToDetailMs = Date.now() - clickedAt;

        // Tablist should be populated with the four detail-pane tabs
        // (Overview / Usage / Metadata / Issues). Scope to the *first*
        // `role="tablist"` in the aside — some preview components (e.g.
        // Tabs) render their own role="tab" elements inside the
        // overview preview, which would otherwise inflate the count.
        const tabs = detailAside.locator('[role="tablist"]').first().locator('[role="tab"]');
        await expect(tabs).toHaveCount(4);

        // Title in the detail pane should match the component name.
        await expect(detailAside.locator('h2')).toHaveText(component.name);

        // Close via Escape — the detail panel installs a global keydown
        // listener that calls onClose on Escape.
        await page.keyboard.press('Escape');
        await expect(detailAside).toBeHidden({ timeout: 5_000 });
      } catch (err) {
        passed = false;
        failureReasons.push(
          err instanceof Error ? `${err.name}: ${err.message}` : String(err),
        );
      }

      const snap = instruments.snapshot();
      if (snap.pageErrors.length > 0) {
        passed = false;
        failureReasons.push(`pageerror x${snap.pageErrors.length}`);
      }
      if (snap.consoleErrors.length > 0) {
        passed = false;
        failureReasons.push(`console.error x${snap.consoleErrors.length}`);
      }
      if (snap.networkErrors.length > 0) {
        passed = false;
        failureReasons.push(`networkError x${snap.networkErrors.length}`);
      }

      recordCard({
        name: component.name,
        slug: component.slug,
        atomicLevel: component.atomicLevel,
        passed,
        failureReasons,
        consoleErrors: snap.consoleErrors,
        pageErrors: snap.pageErrors,
        networkErrors: snap.networkErrors,
        clickToDetailMs,
      });

      // Use soft expectations: we want the test to fail (so the suite
      // surfaces real regressions) but still record the result first.
      expect(
        passed,
        `Card "${component.name}" failed:\n` +
          `  reasons: ${failureReasons.join('; ')}\n` +
          `  consoleErrors:\n${snap.consoleErrors.map((e) => '    - ' + e).join('\n')}\n` +
          `  pageErrors:\n${snap.pageErrors.map((e) => '    - ' + e).join('\n')}\n` +
          `  networkErrors:\n${snap.networkErrors
            .map((n) => `    - ${n.status} ${n.url}`)
            .join('\n')}`,
      ).toBe(true);
    });
  }
});

/**
 * Escape a string for safe inclusion inside a `new RegExp(...)`.
 * Component names like `Form.Switch` would be parsed as "Form<anything>Switch"
 * without escaping; this keeps the match literal.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
