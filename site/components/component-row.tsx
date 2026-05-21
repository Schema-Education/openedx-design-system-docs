'use client';

import { memo } from 'react';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';

interface ComponentRowProps {
  component: GalleryComponent;
  // Receives the full component so the parent can pass a single stable callback
  // for the whole list. Avoids invalidating React.memo per parent render.
  onSelect: (component: GalleryComponent) => void;
  isSelected?: boolean;
}

export const ComponentRow = memo(function ComponentRow({
  component,
  onSelect,
  isSelected = false,
}: ComponentRowProps) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];
  const showStatusBadge = component.status !== 'stable';

  return (
    <button
      type="button"
      onClick={() => onSelect(component)}
      aria-current={isSelected ? 'true' : undefined}
      className={`group relative block w-full border-b px-4 py-3 text-left transition focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ${
        isSelected
          ? 'z-10 border-gray-900 bg-blue-50 shadow-[inset_4px_0_0_0_rgb(17_24_39),inset_0_2px_0_0_rgb(17_24_39)]'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {/* Mobile / narrow (< md, ~768px): stacked layout — the original
          single-row grid clips both the title and the description on narrow
          viewports. We split it into a title row (name + source mfe) and a
          secondary row (atomic pill + description), with metadata badges
          flowing below. */}
      <div className="flex flex-col gap-1.5 md:hidden">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="truncate font-mono text-sm font-semibold text-gray-900 min-w-0 flex-1">
            {component.name}
          </h3>
          <span className="shrink-0 truncate font-mono text-[10px] text-gray-600 max-w-[45%]">
            {component.sourceMfe}
          </span>
        </div>
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`mt-px shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
          >
            {atomic.label}
          </span>
          <p className="text-xs text-gray-600 min-w-0 flex-1">
            {component.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
            {component.functionalCategory}
          </span>
          {showStatusBadge && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}>
              {status.label}
            </span>
          )}
          {component.a11y && (
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
              WCAG {component.a11y}
            </span>
          )}
        </div>
      </div>

      {/* Desktop (≥ md): original 6-column grid. */}
      <div className="hidden w-full md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)_auto_auto_auto_auto] md:items-center md:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
          >
            {atomic.label}
          </span>
          <h3 className="truncate font-mono text-sm font-semibold text-gray-900">
            {component.name}
          </h3>
        </div>

        <p className="truncate text-xs text-gray-600">{component.description}</p>

        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
          {component.functionalCategory}
        </span>

        {showStatusBadge ? (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}>
            {status.label}
          </span>
        ) : (
          <span />
        )}

        {component.a11y ? (
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            WCAG {component.a11y}
          </span>
        ) : (
          <span />
        )}

        <span className="truncate font-mono text-[10px] text-gray-600 text-right">
          {component.sourceMfe}
        </span>
      </div>
    </button>
  );
});
