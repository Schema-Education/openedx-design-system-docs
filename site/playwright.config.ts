import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the docs site regression suite.
 *
 * Spawns `pnpm dev` automatically on first invocation (CI or local) unless
 * a server is already listening on the chosen port. The suite is single-
 * worker by default so that:
 *   1. The aggregate JSON report writes deterministically (no interleaved
 *      writes between parallel workers).
 *   2. The Next.js dev server can compile pages without thrashing under
 *      parallel requests.
 *
 * Tests live under `tests/playwright/`. Tests are not part of the Next
 * build — the directory is excluded from the production bundle by virtue
 * of being outside `app/` and `components/`, and the test runner consumes
 * the source files directly via tsx.
 */

const PORT = Number(process.env.PLAYWRIGHT_DEV_PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/playwright',
  // Be patient with the dev server. The Paragon component subtree can take
  // a while to compile via Turbopack on first request, especially on cold
  // start.
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-results/output',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    // Keep the browser viewport wide enough that the gallery shows the
    // multi-column card grid. The detail-pane width assertions in some
    // tests assume the layout is wide enough not to collapse to mobile.
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // `pnpm dev` runs Turbopack, which currently fails to parse the
    // bundled Paragon `core.min.css` (CSS-after-@charset error). The
    // non-Turbopack `next dev` path works, so the suite uses that by
    // default to keep the regression net running. The `predev` hook is
    // still needed for the devbar snapshot, so we invoke it explicitly
    // alongside `next dev`.
    command:
      process.env.PLAYWRIGHT_WEB_COMMAND ??
      'PROTOTYPE_DEVBAR_ENABLED=true pnpm exec schema-capture-git-info --out ./prototype-devbar.snapshot.json && pnpm exec next dev',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120_000,
  },
});
