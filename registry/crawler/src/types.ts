/**
 * Crawler type definitions.
 *
 * These types mirror the manifest schema defined in
 * `registry/schema/component.schema.json` at the repository root.
 *
 * The schema is the canonical source of truth for validation.
 * Note: `A11yLevel` here uses `'unknown'` (matching the schema enum)
 * rather than `null` (as used in `site/lib/registry.ts`) — the crawled
 * manifests use the string literal from the schema.
 */

/** Atomic design classification level. */
export type AtomicLevel = 'atom' | 'molecule' | 'organism' | 'template' | 'page';

/** Component maturity status. */
export type ComponentStatus = 'stable' | 'experimental' | 'deprecated';

/** WCAG accessibility conformance level. 'unknown' = not yet assessed. */
export type A11yLevel = 'A' | 'AA' | 'AAA' | 'unknown';

/** Full manifest record for a registered component. Matches component.schema.json exactly. */
export interface RegistryComponent {
  /** Display name in PascalCase. */
  name: string;

  /** Atomic design level. */
  atomicLevel: AtomicLevel;

  /** Maturity status. */
  status: ComponentStatus;

  /** Short identifier for the source MFE or package. */
  sourceMfe: string;

  /** Full GitHub repository slug (org/repo). */
  sourceRepo: string;

  /** Relative file path within sourceRepo to the component entry point. */
  sourcePath: string;

  /** SemVer string at the time of last ingestion. */
  version: string;

  /** Figma Code Connect URL, or null if not yet connected. */
  figmaCodeConnectUrl: string | null;

  /** MFE slugs that consume this component. */
  consumers: string[];

  /** WCAG conformance level. */
  a11y: A11yLevel;

  /** ISO 8601 timestamp of the last automated ingestion run. */
  lastIngested: string;
}

/** A registry manifest is an ordered array of component records. */
export type RegistryManifest = RegistryComponent[];
