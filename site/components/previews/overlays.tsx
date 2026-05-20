'use client';

import type { ReactNode } from 'react';
import { Alert, Button, Card as PCard, CloseButton } from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

/**
 * Overlay/portal previews — Paragon's modal, popover, tooltip, sheet, menu,
 * etc. all render via portals to document.body and are invisible by default.
 * For card thumbnails we render only the *inner panel* of each component,
 * styled with Card primitives, so the user sees what the "open" state looks
 * like without actually mounting a portal or trapping focus.
 *
 * Trade-off: these are visual representations of the inner content, not the
 * full modal lifecycle. Real interactive instances arrive in Phase 2b.
 */

function MiniPanel({
  title,
  body,
  width = 220,
  showClose = true,
}: {
  title: string;
  body: string;
  width?: number;
  showClose?: boolean;
}) {
  return (
    <PreviewSlot width={width}>
      <PCard>
        <PCard.Section className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <strong className="text-xs">{title}</strong>
            <span className="text-[11px] text-gray-600">{body}</span>
          </div>
          {showClose ? <CloseButton onClick={() => undefined} /> : null}
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  );
}

export const OVERLAY_PREVIEWS: Record<string, () => ReactNode> = {
  Tooltip: () => (
    <PreviewSlot width={140}>
      <div className="rounded bg-gray-800 px-2 py-1 text-center text-[11px] text-white shadow">
        Tooltip text
      </div>
    </PreviewSlot>
  ),
  Popover: () => (
    <MiniPanel
      title="Popover title"
      body="Short body content."
      showClose={false}
    />
  ),
  ModalDialog: () => (
    <MiniPanel title="Confirm action" body="Are you sure you want to continue?" />
  ),
  ModalPopup: () => (
    <MiniPanel
      title="Quick action"
      body="Choose an option below."
      showClose={false}
    />
  ),
  ModalLayer: () => (
    <PreviewSlot width={220}>
      <div className="rounded border-2 border-dashed border-gray-400 bg-gray-100 p-3 text-center text-[11px] text-gray-700">
        Modal layer (portal target)
      </div>
    </PreviewSlot>
  ),
  AlertModal: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section>
          <Alert variant="warning" dismissible={false} className="m-0">
            Heads up — please confirm
          </Alert>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="tertiary" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              OK
            </Button>
          </div>
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  FullscreenModal: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section className="flex items-center justify-between">
          <strong className="text-xs">Fullscreen Modal</strong>
          <CloseButton onClick={() => undefined} />
        </PCard.Section>
        <PCard.Section className="text-[11px] text-gray-600">
          Full-bleed content area
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  MarketingModal: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.ImageCap
          src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 60'%3E%3Crect width='220' height='60' fill='%23818cf8'/%3E%3C/svg%3E"
          srcAlt="Hero"
        />
        <PCard.Section>
          <strong className="text-xs">New feature</strong>
          <p className="m-0 text-[11px] text-gray-600">Learn more about it.</p>
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  StandardModal: () => (
    <MiniPanel title="Standard Modal" body="Body content goes here." />
  ),
  Sheet: () => (
    <PreviewSlot width={220}>
      <div className="flex h-20 overflow-hidden rounded border">
        <div className="flex-1 bg-gray-100" />
        <div className="w-2/3 border-l bg-white p-2 text-[11px]">
          <strong>Sheet</strong>
          <p className="m-0 text-gray-600">Side panel content</p>
        </div>
      </div>
    </PreviewSlot>
  ),
  Menu: () => (
    <PreviewSlot width={180}>
      <PCard>
        <ul className="m-0 list-none p-0 text-xs">
          <li className="px-3 py-1.5 hover:bg-gray-50">Profile</li>
          <li className="px-3 py-1.5 hover:bg-gray-50">Settings</li>
          <li className="px-3 py-1.5 hover:bg-gray-50">Sign out</li>
        </ul>
      </PCard>
    </PreviewSlot>
  ),
  Overlay: () => (
    <PreviewSlot width={220}>
      <div className="rounded border-2 border-dashed border-gray-400 bg-gray-100 p-3 text-center text-[11px] text-gray-700">
        Overlay (positioning wrapper)
      </div>
    </PreviewSlot>
  ),
  ProductTour: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section>
          <div className="flex items-center justify-between">
            <strong className="text-xs">Step 1 of 3</strong>
            <span className="text-[10px] text-gray-500">●○○</span>
          </div>
          <p className="m-0 mt-1 text-[11px] text-gray-600">
            Click here to get started.
          </p>
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
};
