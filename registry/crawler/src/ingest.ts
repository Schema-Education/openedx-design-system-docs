/**
 * End-to-end ingestion orchestrator.
 *
 * For each configured source: fetch → validate → generate MDX per component.
 * Returns a per-source summary with component counts, written paths, and errors.
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSources, fetchManifest } from './sources.js';
import { validateManifest } from './validate.js';
import { writeMdx } from './generate.js';

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url + '/../'));

/** Per-source ingestion result. */
export interface IngestSourceResult {
  /** The source name from config. */
  source: string;
  /** Number of components successfully written. */
  components: number;
  /** Absolute paths of written MDX files. */
  written: string[];
  /** Validation or fetch errors encountered. */
  errors: string[];
}

export interface IngestOptions {
  /** Path to sources config JSON. Defaults to `<package-root>/config/sources.json`. */
  sourcesConfig?: string;
  /** Absolute path to the output directory (site/content/registry). */
  outputDir: string;
  /** Absolute path to component.schema.json. */
  schemaPath: string;
  /**
   * When true, only the first source in config (the fixture) is used,
   * regardless of how many sources are configured.
   */
  fromFixtures?: boolean;
}

/**
 * Run ingestion for all (or fixture-only) configured sources.
 */
export async function ingestAll(opts: IngestOptions): Promise<IngestSourceResult[]> {
  const { outputDir, schemaPath, fromFixtures = false } = opts;

  let sources = await loadSources(opts.sourcesConfig);

  if (fromFixtures) {
    // Only process sources whose ref is 'fixture'.
    sources = sources.filter((s) => s.ref === 'fixture');
    if (sources.length === 0) {
      console.warn(
        'Warning: --from-fixtures was passed but no sources with ref="fixture" were found in config.'
      );
    }
  }

  const results: IngestSourceResult[] = [];

  for (const source of sources) {
    const result: IngestSourceResult = {
      source: source.name,
      components: 0,
      written: [],
      errors: [],
    };

    let rawData: unknown;
    try {
      rawData = await fetchManifest(source);
    } catch (err) {
      result.errors.push(`Fetch failed: ${String(err)}`);
      results.push(result);
      continue;
    }

    const validation = await validateManifest(rawData, schemaPath);

    if (!validation.valid) {
      result.errors.push(...validation.errors.map((e) => `Validation: ${e}`));
      results.push(result);
      continue;
    }

    for (const component of validation.manifest) {
      try {
        const absPath = await writeMdx(outputDir, component);
        result.written.push(absPath);
        result.components++;
      } catch (err) {
        result.errors.push(`Write failed for ${component.name}: ${String(err)}`);
      }
    }

    results.push(result);
  }

  return results;
}

/** Resolve standard paths relative to the package root. */
export function resolveDefaults(): {
  outputDir: string;
  schemaPath: string;
} {
  // Walk up two levels: src/ → crawler/ → registry/ → repo root
  const repoRoot = resolve(PACKAGE_ROOT, '..', '..');
  return {
    outputDir: resolve(repoRoot, 'site', 'content', 'registry'),
    schemaPath: resolve(repoRoot, 'registry', 'schema', 'component.schema.json'),
  };
}
