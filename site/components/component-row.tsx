'use client';

import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';

interface ComponentRowProps {
  component: GalleryComponent;
  onClick: () => void;
  isSelected?: boolean;
}

export function ComponentRow({ component, onClick, isSelected = false }: ComponentRowProps) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isSelected ? 'true' : undefined}
      className={`group relative grid w-full grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)_auto_auto_auto_auto] items-center gap-4 border-b px-4 py-3 text-left transition focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ${
        isSelected
          ? 'z-10 border-gray-900 bg-blue-50 shadow-[inset_4px_0_0_0_rgb(17_24_39),inset_0_2px_0_0_rgb(17_24_39)]'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
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

      {component.status !== 'stable' ? (
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}
        >
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
    </button>
  );
}
