'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';
import { PARAGON_PREVIEWS } from './paragon-previews';
import { useInViewport } from '@/lib/use-in-viewport';

interface ComponentCardProps {
  component: GalleryComponent;
  // Receives the full component so the parent can pass a single stable callback
  // for the whole grid. Avoids an `onClick={() => onClick(c)}` closure per card
  // per parent render, which would invalidate React.memo's shallow prop check.
  onSelect: (component: GalleryComponent) => void;
  isSelected?: boolean;
}

export const ComponentCard = memo(function ComponentCard({
  component,
  onSelect,
  isSelected = false,
}: ComponentCardProps) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];
  const initial = component.name
    .replace(/^Form\./, '')
    .replace(/^DataTable\./, '')
    .charAt(0);

  // Lazy-render the live Paragon preview only after the card scrolls into
  // (or near) the viewport. Until then the gradient/initial placeholder
  // stands in for the live render. This:
  //   - cuts the initial render cost on /registry by 100+ live Paragon
  //     subtrees (cards mostly stay off-screen at first paint), and
  //   - skips SSR of Paragon Form components entirely, which avoids the
  //     module-counter-based hydration mismatch tracked in #71.
  const [cardRef, isVisible] = useInViewport<HTMLDivElement>();
  const previewRender =
    isVisible && component.sourceMfe === 'paragon'
      ? PARAGON_PREVIEWS[component.name]
      : undefined;

  // Paragon previews are rendered client-only. Several Paragon components
  // (notably Form.Switch / Form.Control / Form.Checkbox) use an internal
  // ID counter for accessibility labels; SSR and the first client render
  // produce different IDs ("form-field1" vs "form-field6"), tripping React's
  // hydration mismatch warning and unsettling the Next.js dev devbar with
  // a "1 Issue" badge for every search/filter the user runs.
  //
  // Gating the preview on a mount flag guarantees the SSR HTML and the first
  // client render both produce the same null placeholder; the real preview
  // renders only after hydration completes, so the IDs Paragon generates on
  // the client can't disagree with anything on the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let previewNode: ReactNode = null;
  if (mounted && previewRender) {
    try {
      previewNode = previewRender();
    } catch (err) {
      if (typeof window === 'undefined') {
        // eslint-disable-next-line no-console
        console.warn(`[preview] ${component.name} threw during SSR:`, err);
      }
      previewNode = null;
    }
  }

  const isMfe = component.sourceMfe !== 'paragon';
  const sourceUrl =
    isMfe && component.sourceRepo
      ? `https://github.com/${component.sourceRepo}/tree/HEAD/${component.sourcePath}`
      : null;

  return (
    <div
      ref={cardRef}
      aria-current={isSelected ? 'true' : undefined}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-left transition focus-within:ring-2 focus-within:ring-offset-2 ${
        isSelected ? '' : atomic.ring
      } ${
        isSelected
          ? 'border-2 border-gray-900 shadow-lg'
          : 'border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Preview slot — sits above the title-button overlay so interactive Paragon content stays clickable.
          Clicks outside interactive children still open the detail pane via the onClick below. */}
      <div
        className="relative z-10 flex h-32 cursor-pointer items-center justify-center overflow-hidden bg-gray-50 px-4"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(
              'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="menuitem"]',
            )
          ) {
            return;
          }
          onSelect(component);
        }}
      >
        {previewNode ? (
          previewNode
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${atomic.gradient}`}
          >
            <span className="text-4xl font-bold text-gray-900/80">
              {initial}
            </span>
          </div>
        )}
        <span
          className={`absolute right-2 top-2 z-20 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
        >
          {atomic.label}
        </span>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 z-20 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm hover:bg-white hover:text-gray-900"
          >
            View source ↗
          </a>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-sm font-semibold text-gray-900">
            <button
              type="button"
              onClick={() => onSelect(component)}
              className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none"
            >
              {component.name}
            </button>
          </h3>
          {component.status !== 'stable' && (
            <span
              className={`relative z-10 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}
            >
              {status.label}
            </span>
          )}
        </div>

        <p className="mt-1.5 line-clamp-2 text-xs text-gray-600">
          {component.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
            {component.functionalCategory}
          </span>
          {component.a11y && (
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              WCAG {component.a11y}
            </span>
          )}
          <span className="ml-auto truncate font-mono text-[10px] text-gray-600">
            {component.sourceMfe}
          </span>
        </div>
      </div>
    </div>
  );
});
