'use client';

import type { ReactNode } from 'react';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';
import { PARAGON_PREVIEWS } from './paragon-previews';

interface ComponentCardProps {
  component: GalleryComponent;
  onClick: () => void;
  isSelected?: boolean;
}

export function ComponentCard({ component, onClick, isSelected = false }: ComponentCardProps) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];
  const initial = component.name
    .replace(/^Form\./, '')
    .replace(/^DataTable\./, '')
    .charAt(0);

  const previewRender =
    component.sourceMfe === 'paragon'
      ? PARAGON_PREVIEWS[component.name]
      : undefined;
  let previewNode: ReactNode = null;
  if (previewRender) {
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
      aria-current={isSelected ? 'true' : undefined}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-left transition focus-within:ring-2 focus-within:ring-offset-2 ${
        isSelected ? '' : atomic.ring
      } ${
        isSelected
          ? 'border-2 border-gray-900 shadow-lg'
          : 'border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Preview slot — sits above the title-button overlay so interactive Paragon content stays clickable */}
      <div className="relative z-10 flex h-32 items-center justify-center overflow-hidden bg-gray-50 px-4">
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
              onClick={onClick}
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
}
