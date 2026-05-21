'use client';

import type { ReactNode } from 'react';
import { Badge } from '@openedx/paragon';

/**
 * Badge that marks a preview as a deliberate mock rather than a live Paragon
 * render. Used for components Paragon v23.x cannot render under React 19
 * (`DataTable`, `Form.Checkbox`, `Form.Autosuggest`, `ColorPicker`, `Dropzone`)
 * and for cases where Paragon's component portals out of the card container
 * (`Toast`). The badge itself is a Paragon `Badge` so even the mock label is
 * built from the design system.
 */
export function MockedBadge({ reason }: { reason: string }) {
  return (
    <Badge
      variant="warning"
      className="!text-[9px] !font-semibold uppercase tracking-wide"
      title={reason}
    >
      Mocked
    </Badge>
  );
}

/**
 * Stacks `MockedBadge` above the preview content. Keeps the badge out of the
 * content flow without absolutely positioning it on top of (and obscuring)
 * the underlying Paragon-styled mock surface.
 */
export function MockedWrapper({
  reason,
  children,
}: {
  reason: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <MockedBadge reason={reason} />
      {children}
    </div>
  );
}
