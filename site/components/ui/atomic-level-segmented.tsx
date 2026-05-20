'use client';

import React from 'react';
import type { AtomicLevel } from '@/lib/registry';
import { ATOMIC_LEVEL_META } from '@/lib/gallery';

interface AtomicLevelSegmentedProps {
  /** Canonical order, e.g. ['atom','molecule','organism','template','page'] */
  levels: AtomicLevel[];
  selected: Set<AtomicLevel>;
  onChange: (next: Set<AtomicLevel>) => void;
  /** Levels with 0 matches given other active filters */
  disabledLevels?: Set<AtomicLevel>;
  /** Optional count badge per level */
  counts?: Partial<Record<AtomicLevel, number>>;
  className?: string;
}

/** Tiny inline checkmark SVG — shown inside active pill buttons. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="currentColor"
      className="w-3 h-3 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M10.28 2.28a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L4.5 7.19l4.97-4.97a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Segmented pill-group control for filtering by Atomic Design level.
 *
 * - Click an inactive level → adds it to `selected`.
 * - Click an active level → removes it from `selected`.
 * - Click a disabled level → no-op.
 * - Empty selection means "all levels" — parent decides the semantic.
 *
 * Colors come from `ATOMIC_LEVEL_META` in `lib/gallery.ts`:
 *   atom      → bg-sky-100 text-sky-800 / ring-sky-300
 *   molecule  → bg-emerald-100 text-emerald-800 / ring-emerald-300
 *   organism  → bg-violet-100 text-violet-800 / ring-violet-300
 *   template  → bg-amber-100 text-amber-800 / ring-amber-300
 *   page      → bg-rose-100 text-rose-800 / ring-rose-300
 *
 * All Tailwind classes are safelisted in tailwind.config.ts so they
 * survive static analysis purging.
 */
export function AtomicLevelSegmented({
  levels,
  selected,
  onChange,
  disabledLevels,
  counts,
  className = '',
}: AtomicLevelSegmentedProps) {
  function handleClick(level: AtomicLevel) {
    if (disabledLevels?.has(level)) return;

    const next = new Set(selected);
    if (next.has(level)) {
      next.delete(level);
    } else {
      next.add(level);
    }
    onChange(next);
  }

  return (
    <div
      role="group"
      aria-label="Atomic level filter"
      className={`inline-flex rounded-full bg-gray-100 p-1 ${className}`}
    >
      {levels.map((level) => {
        const meta = ATOMIC_LEVEL_META[level];
        const isSelected = selected.has(level);
        const isDisabled = disabledLevels?.has(level) ?? false;
        const count = counts?.[level];

        // Build class string for the button based on state.
        // Active state uses the per-level Tailwind tokens from ATOMIC_LEVEL_META.
        let buttonClasses =
          'rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

        if (isDisabled) {
          buttonClasses += ' text-gray-400 cursor-not-allowed opacity-60';
        } else if (isSelected) {
          // `meta.color` is e.g. "bg-sky-100 text-sky-800"
          // `meta.ring` is e.g. "ring-sky-300"
          buttonClasses += ` ${meta.color} ring-1 ring-inset ${meta.ring} shadow-sm`;
        } else {
          buttonClasses += ' text-gray-700 hover:bg-white hover:shadow-sm';
        }

        return (
          <button
            key={level}
            type="button"
            aria-pressed={isSelected}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            onClick={() => handleClick(level)}
            className={buttonClasses}
          >
            {isSelected && <CheckIcon />}
            <span>{meta.label}</span>
            {count !== undefined && (
              <span
                className={
                  isDisabled
                    ? 'text-gray-400'
                    : isSelected
                    ? 'opacity-60'
                    : 'text-gray-500'
                }
              >
                {isDisabled ? '(0)' : `· ${count}`}
              </span>
            )}
            {count === undefined && isDisabled && (
              <span className="text-gray-400">(0)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AtomicLevelSegmented;
