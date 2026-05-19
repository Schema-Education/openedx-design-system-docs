'use client';

/**
 * MultiSelectCombobox — a searchable, multi-select dropdown primitive built on
 * Headless UI v2 `Combobox` with `multiple`.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
 *
 * const STATUS_OPTIONS = [
 *   { value: 'stable',       label: 'Stable',       count: 42, color: 'bg-success' },
 *   { value: 'experimental', label: 'Experimental', count: 17, color: 'bg-warning' },
 *   { value: 'deprecated',   label: 'Deprecated',   count:  6, color: 'bg-danger'  },
 * ] as const;
 *
 * function StatusFilter() {
 *   const [selected, setSelected] = useState(new Set<string>());
 *   return (
 *     <MultiSelectCombobox
 *       label="Status"
 *       options={STATUS_OPTIONS}
 *       selected={selected}
 *       onChange={setSelected}
 *       placeholder="Search statuses…"
 *       emptyHint="No matching statuses."
 *     />
 *   );
 * }
 * ```
 */

import { useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Option<T extends string> = {
  /** The underlying value stored in the selection Set. */
  value: T;
  /** Human-readable label rendered in the dropdown. */
  label: string;
  /** Optional count displayed as a muted "(14)" suffix on each option row. */
  count?: number;
  /**
   * Optional Tailwind class string for a leading color swatch.
   * Useful for Status filters, e.g. `"bg-success"`.
   */
  color?: string;
};

export interface MultiSelectComboboxProps<T extends string> {
  /** Text shown on the trigger button when nothing is selected. */
  label: string;
  options: Option<T>[];
  selected: Set<T>;
  onChange: (next: Set<T>) => void;
  /** Placeholder for the inner search input. Defaults to "Search…". */
  placeholder?: string;
  /** Message displayed when the search yields no matching options. */
  emptyHint?: string;
  /** Optional extra class applied to the outermost wrapper div. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Inline SVG chevron pointing down. */
function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Inline SVG magnifier for the search input. */
function MagnifierIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="pointer-events-none h-4 w-4 shrink-0 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Inline SVG checkmark used inside the checkbox indicator. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      fill="none"
      stroke="white"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[10px] w-[10px]"
    >
      <polyline points="2,7 5.5,10.5 12,3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A searchable, multi-select dropdown built on Headless UI v2 `Combobox`.
 *
 * @typeParam T - String union of allowed option values, inferred from `options`.
 */
export function MultiSelectCombobox<T extends string>({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Search…',
  emptyHint = 'No matches.',
  className,
}: MultiSelectComboboxProps<T>) {
  // Local search query — not lifted to the caller.
  const [query, setQuery] = useState('');

  // Filtered options based on current search query.
  const filtered =
    query === ''
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );

  // Derive trigger button label text.
  function triggerLabel(): string {
    if (selected.size === 0) return label;
    if (selected.size === 1) {
      const single = options.find((o) => selected.has(o.value));
      return single ? `${label}: ${single.label}` : label;
    }
    return `${label} · ${selected.size} selected`;
  }

  // Handle array emitted by Headless UI → sync to Set → lift up.
  function handleChange(vals: T[]) {
    onChange(new Set(vals));
  }

  // "Select all visible" — adds every filtered option to the selection.
  function selectAllVisible() {
    const next = new Set(selected);
    filtered.forEach((o) => next.add(o.value));
    onChange(next);
  }

  // "Clear" — empties selection entirely.
  function clearAll() {
    onChange(new Set<T>());
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((o) => selected.has(o.value));

  return (
    <div className={`relative inline-block text-left${className ? ` ${className}` : ''}`}>
      <Combobox
        multiple
        value={Array.from(selected)}
        onChange={handleChange}
        onClose={() => setQuery('')}
      >
        {/* ── Trigger button ── */}
        <ComboboxButton
          className="
            inline-flex items-center gap-1.5
            rounded-md border border-gray-300 bg-white
            px-3 py-2 text-sm text-ink-900
            shadow-sm
            hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors duration-100
          "
        >
          <span className="max-w-[160px] truncate">{triggerLabel()}</span>

          {/* Badge showing count when items are selected */}
          {selected.size > 0 && (
            <span
              aria-label={`${selected.size} selected`}
              className="
                ml-0.5 flex h-4 min-w-[1rem] items-center justify-center
                rounded-full bg-primary-600 px-1
                text-[10px] font-semibold leading-none text-white
              "
            >
              {selected.size}
            </span>
          )}

          <ChevronIcon />
        </ComboboxButton>

        {/* ── Popover panel ── */}
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ComboboxOptions
            static={false}
            className="
              absolute left-0 z-50 mt-1
              min-w-full w-max max-w-xs
              rounded-md border border-gray-200 bg-white
              shadow-lg ring-1 ring-gray-900/5
              focus:outline-none
            "
          >
            {/* Search input row */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <MagnifierIcon />
              <ComboboxInput
                aria-label={`Search ${label}`}
                placeholder={placeholder}
                displayValue={() => query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full bg-transparent text-sm text-ink-900
                  placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </div>

            {/* "Select all" / "Clear" action row */}
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-1.5">
              <button
                type="button"
                disabled={allVisibleSelected || filtered.length === 0}
                onClick={selectAllVisible}
                className="
                  text-xs font-medium text-primary-600
                  hover:text-primary-700
                  disabled:cursor-not-allowed disabled:opacity-40
                  transition-colors duration-100
                "
              >
                Select all {query ? '(visible)' : ''}
              </button>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={clearAll}
                className="
                  text-xs font-medium text-gray-500
                  hover:text-gray-700
                  disabled:cursor-not-allowed disabled:opacity-40
                  transition-colors duration-100
                "
              >
                Clear
              </button>
            </div>

            {/* Options list */}
            <div className="max-h-[260px] overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">{emptyHint}</p>
              ) : (
                filtered.map((opt) => (
                  <ComboboxOption
                    key={opt.value}
                    value={opt.value}
                    className="
                      flex cursor-pointer select-none items-center gap-2
                      px-3 py-2 text-sm text-ink-900
                      data-[focus]:bg-gray-50
                    "
                  >
                    {({ selected: isSelected }) => (
                      <>
                        {/* Checkbox indicator */}
                        <span
                          aria-hidden="true"
                          className={`
                            flex h-[14px] w-[14px] shrink-0 items-center justify-center
                            rounded-[3px] border
                            ${isSelected
                              ? 'border-primary-600 bg-primary-600'
                              : 'border-gray-300 bg-white'}
                          `}
                        >
                          {isSelected && <CheckIcon />}
                        </span>

                        {/* Optional color swatch */}
                        {opt.color && (
                          <span
                            aria-hidden="true"
                            className={`h-[6px] w-[6px] shrink-0 rounded-full ${opt.color}`}
                          />
                        )}

                        {/* Label */}
                        <span className="flex-1 truncate">{opt.label}</span>

                        {/* Count */}
                        {opt.count !== undefined && (
                          <span className="ml-auto shrink-0 text-xs text-gray-400">
                            ({opt.count})
                          </span>
                        )}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </div>
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );
}

export default MultiSelectCombobox;
