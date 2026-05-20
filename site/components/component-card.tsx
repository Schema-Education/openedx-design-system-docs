'use client';

import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';

interface ComponentCardProps {
  component: GalleryComponent;
  onClick: () => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];
  const initial = component.name
    .replace(/^Form\./, '')
    .replace(/^DataTable\./, '')
    .charAt(0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${atomic.ring}`}
    >
      {/* Thumbnail placeholder */}
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${atomic.gradient}`}
      >
        <span className="text-4xl font-bold text-gray-900/80">
          {initial}
        </span>
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
        >
          {atomic.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-sm font-semibold text-gray-900">
            {component.name}
          </h3>
          {component.status !== 'stable' && (
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}
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
    </button>
  );
}
