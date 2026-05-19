/**
 * PreviewFrame — stub component.
 *
 * TODO: ADR-0001 — Future Sandpack live preview integration.
 *
 * When Phase 2b ships, this component will:
 *   1. Accept a `componentName` + `defaultProps` as inputs
 *   2. Render a Sandpack <SandpackProvider> with the component loaded from
 *      the @openedx/paragon package
 *   3. Allow live prop editing via Sandpack's code editor panel
 *
 * Do NOT install @codesandbox/sandpack-react until that phase starts.
 * See the ADR in docs/adr/ADR-0001-sandpack-preview.md for context.
 */

import type { ReactNode } from 'react';

interface PreviewFrameProps {
  children?: ReactNode;
  /** Label shown in the preview frame header */
  label?: string;
  /** Minimum height of the preview area in px */
  minHeight?: number;
}

/**
 * Renders `children` inside a visually distinct bordered preview container.
 * Once Sandpack is integrated, this wrapper will be replaced with a live
 * code editor + rendered output panel.
 */
export function PreviewFrame({
  children,
  label = 'Preview',
  minHeight = 120,
}: PreviewFrameProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50">
      {/* Frame header */}
      <div className="flex items-center border-b border-gray-200 bg-white px-4 py-2">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        {/* TODO: Add "Open in CodeSandbox" button here (Phase 2b) */}
      </div>
      {/* Preview content */}
      <div
        className="flex items-center justify-center p-6"
        style={{ minHeight }}
      >
        {children ?? (
          <p className="text-sm italic text-gray-400">
            Live preview coming in Phase 2b (Sandpack integration)
          </p>
        )}
      </div>
    </div>
  );
}

export default PreviewFrame;
