/**
 * Registry type definitions.
 *
 * These types mirror the manifest schema defined in
 * `registry/schema/component.schema.json` at the repository root.
 *
 * Keep in sync with that schema — a future CI step will validate
 * registry MDX frontmatter against it automatically (Phase 2a).
 */

/**
 * Atomic design classification level.
 * Every registered component must have exactly one of these values.
 */
export type AtomicLevel = 'atom' | 'molecule' | 'organism' | 'template' | 'page';

/**
 * WCAG accessibility conformance level reported for the component.
 * null = not yet assessed.
 */
export type A11yLevel = 'A' | 'AA' | 'AAA' | null;

/**
 * Component status in the source MFE or design system.
 */
export type ComponentStatus =
  | 'stable'
  | 'beta'
  | 'deprecated'
  | 'experimental'
  | 'unknown';

/**
 * Full manifest record for a registered component.
 * Corresponds 1:1 to the MDX frontmatter in content/registry/<level>/<name>.mdx.
 */
export interface RegistryComponent {
  /** Display name of the component (PascalCase) */
  name: string;

  /** Atomic design level */
  atomicLevel: AtomicLevel;

  /** Current stability status */
  status: ComponentStatus;

  /**
   * Short identifier for the source MFE or package.
   * Examples: "paragon", "frontend-app-learning", "frontend-app-authoring"
   */
  sourceMfe: string;

  /**
   * GitHub repository slug (owner/repo) where the source lives.
   * Example: "openedx/paragon"
   */
  sourceRepo: string;

  /**
   * Relative file path within sourceRepo to the component's entry point.
   * Example: "src/Button/index.jsx"
   */
  sourcePath: string;

  /**
   * Version of sourceRepo at the time of last ingestion.
   * SemVer string. Example: "22.4.0"
   */
  version: string;

  /**
   * Figma Code Connect URL for this component.
   * null until the Figma Code Connect integration phase (Phase 2b).
   * TODO: populate via the Figma crawler once ADR-0002 is actioned.
   */
  figmaCodeConnectUrl: string | null;

  /**
   * List of MFE identifiers that import this component.
   * Populated by the dependency graph crawler (Phase 2a).
   */
  consumers: string[];

  /**
   * WCAG conformance level. null = not yet assessed.
   */
  a11y: A11yLevel;

  /**
   * ISO 8601 timestamp of the last automated ingestion run.
   * Example: "2026-05-19T00:00:00Z"
   */
  lastIngested: string;
}
