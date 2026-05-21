/**
 * Aggregate JSON report writer.
 *
 * Each card-level test calls `recordCard()` with its result; the
 * `playwright.config.ts` `globalTeardown` (or the final test) flushes
 * everything to `test-results/registry-coverage.json` so a reviewer can
 * eyeball the pass/fail matrix at a glance without re-running the suite.
 *
 * We accumulate to a process-local module singleton AND write through to
 * disk after every record() — this way, even if the suite is interrupted
 * (e.g. SIGINT during a long run), the partial results survive. Single-
 * worker config makes this safe; if we ever bump workers > 1, switch to a
 * per-worker shard file + a globalTeardown merge.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { NetworkError } from './page-instruments';

// CJS module — `__dirname` is available (Playwright runs test files via
// tsx without `type: "module"`).
const SITE_ROOT = path.resolve(__dirname, '..', '..', '..');
const REPORT_PATH = path.join(
  SITE_ROOT,
  'test-results',
  'registry-coverage.json',
);

export interface CardResult {
  name: string;
  slug: string;
  atomicLevel: string;
  passed: boolean;
  failureReasons: string[];
  consoleErrors: string[];
  pageErrors: string[];
  networkErrors: NetworkError[];
  /** card click → detail-pane-visible elapsed ms */
  clickToDetailMs: number | null;
}

interface ReportShape {
  generatedAt: string;
  totalCards: number;
  passed: number;
  failed: number;
  cards: CardResult[];
}

/**
 * Read-merge-write on every record() call.
 *
 * Playwright respawns the worker process after a test failure (default
 * `workerIsolation`), which means an in-memory buffer can't survive
 * across the test boundary that produced the failure. The simplest
 * durable accumulator is to read the JSON back from disk, merge the new
 * record by name (later record wins), and write it out again. The file
 * is tiny (≈70 entries × a few KB), so the I/O cost is negligible
 * relative to the per-test browser overhead.
 */
export function recordCard(result: CardResult): void {
  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  let existing: CardResult[] = [];
  if (existsSync(REPORT_PATH)) {
    try {
      const parsed = JSON.parse(readFileSync(REPORT_PATH, 'utf8')) as ReportShape;
      existing = Array.isArray(parsed.cards) ? parsed.cards : [];
    } catch {
      // Corrupt / partial write from a prior interrupted run — overwrite.
      existing = [];
    }
  }
  const merged = existing.filter((c) => c.name !== result.name);
  merged.push(result);
  const passed = merged.filter((c) => c.passed).length;
  const report: ReportShape = {
    generatedAt: new Date().toISOString(),
    totalCards: merged.length,
    passed,
    failed: merged.length - passed,
    cards: merged.sort((a, b) => a.name.localeCompare(b.name)),
  };
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
}

export function getReportPath(): string {
  return REPORT_PATH;
}
