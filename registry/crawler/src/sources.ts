/**
 * Source resolution for registry manifests.
 *
 * Supports two URL schemes:
 *   - `file://./path/to/manifest.json`  — resolved relative to the crawler package root
 *   - `https://...`                     — fetched via the built-in fetch API (Node 20+)
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/** Describes a single MFE manifest source. */
export interface Source {
  /** Human-readable name of the MFE. */
  name: string;
  /** Branch, tag, or 'fixture' label. */
  ref: string;
  /** Either a `file://` relative path or an `https://` GitHub raw URL. */
  manifestUrl: string;
  /** Optional description shown in logs. */
  description?: string;
}

/** Shape of config/sources.json. */
interface SourcesConfig {
  sources: Source[];
}

/** Absolute path of the crawler package root. */
const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url + '/../'));

/**
 * Load the list of sources from a JSON config file.
 * Defaults to `<package-root>/config/sources.json`.
 */
export async function loadSources(configPath?: string): Promise<Source[]> {
  const resolved = configPath
    ? resolve(configPath)
    : resolve(PACKAGE_ROOT, 'config', 'sources.json');

  const raw = await readFile(resolved, 'utf-8');
  const config = JSON.parse(raw) as SourcesConfig;

  if (!Array.isArray(config.sources)) {
    throw new Error(`sources.json must have a top-level "sources" array`);
  }

  return config.sources;
}

/**
 * Fetch the raw manifest data for a source.
 * Returns the parsed JSON (unknown — caller must validate).
 */
export async function fetchManifest(source: Source): Promise<unknown> {
  const { manifestUrl } = source;

  if (manifestUrl.startsWith('file://')) {
    // Strip the `file://` prefix and treat as a path relative to package root.
    const relativePath = manifestUrl.slice('file://'.length);
    const absolutePath = resolve(PACKAGE_ROOT, relativePath);
    const raw = await readFile(absolutePath, 'utf-8');
    return JSON.parse(raw);
  }

  if (manifestUrl.startsWith('https://') || manifestUrl.startsWith('http://')) {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch manifest for "${source.name}" from ${manifestUrl}: ` +
          `HTTP ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }

  throw new Error(
    `Unsupported URL scheme in manifestUrl: "${manifestUrl}". ` +
      `Expected "file://" or "https://".`
  );
}
