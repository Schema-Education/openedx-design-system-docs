'use client';

/**
 * MultiSelectCombobox — a searchable, multi-select dropdown primitive.
 *
 * Implementation note: built on Headless UI v2 `Popover` (for the trigger +
 * panel positioning) wrapping a custom controlled selection list with a
 * search input. We previously used `Combobox` with `multiple`, but Headless
 * UI v2's `Combobox` does not support arbitrary non-option children inside
 * `ComboboxOptions`; placing a `ComboboxInput` and a "Select all / Clear"
 * row inside the listbox caused hit-testing on option rows to fall through
 * to the listbox parent, making the options effectively unclickable.
 */

import { useState } from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
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

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0 text-gray-600"
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="pointer-events-none h-4 w-4 shrink-0 text-gray-600"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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

export function MultiSelectCombobox<T extends string>({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Search…',
  emptyHint = 'No matches.',
  className,
}: MultiSelectComboboxProps<T>) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );

  function triggerLabel(): string {
    if (selected.size === 0) return label;
    if (selected.size === 1) {
      const single = options.find((o) => selected.has(o.value));
      return single ? `${label}: ${single.label}` : label;
    }
    return `${label} · ${selected.size} selected`;
  }

  function toggle(value: T) {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  }

  function selectAllVisible() {
    const next = new Set(selected);
    filtered.forEach((o) => next.add(o.value));
    onChange(next);
  }

  function clearAll() {
    onChange(new Set<T>());
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((o) => selected.has(o.value));

  return (
    <div className={`relative inline-block text-left${className ? ` ${className}` : ''}`}>
      <Popover>
        {({ close }) => (
          <>
            <PopoverButton
              className="
                inline-flex items-center gap-1.5
                rounded-md border border-gray-500 bg-white
                px-3 py-2 text-sm text-ink-900
                shadow-sm
                hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                transition-colors duration-100
              "
            >
              <span className="max-w-[160px] truncate">{triggerLabel()}</span>
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
            </PopoverButton>

            <Transition
              afterLeave={() => setQuery('')}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <PopoverPanel
                className="
                  absolute left-0 z-50 mt-1
                  min-w-full w-max max-w-xs
                  origin-top
                  rounded-md border border-gray-200 bg-white
                  shadow-lg ring-1 ring-gray-900/5
                  focus:outline-none
                "
              >
                {/* Search input row */}
                <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                  <MagnifierIcon />
                  <input
                    type="text"
                    aria-label={`Search ${label}`}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') close();
                    }}
                    autoFocus
                    className="
                      w-full bg-transparent text-sm text-ink-900
                      placeholder:text-gray-600
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
                <ul
                  role="listbox"
                  aria-multiselectable="true"
                  aria-label={label}
                  className="max-h-[260px] overflow-y-auto py-1"
                >
                  {filtered.length === 0 ? (
                    <li className="py-4 text-center text-sm text-gray-600">
                      {emptyHint}
                    </li>
                  ) : (
                    filtered.map((opt) => {
                      const isSelected = selected.has(opt.value);
                      return (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={0}
                          onClick={() => toggle(opt.value)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggle(opt.value);
                            }
                          }}
                          className="
                            flex cursor-pointer select-none items-center gap-2
                            px-3 py-2 text-sm text-ink-900
                            hover:bg-gray-50
                            focus:bg-gray-50 focus:outline-none
                          "
                        >
                          <span
                            aria-hidden="true"
                            className={`
                              flex h-[14px] w-[14px] shrink-0 items-center justify-center
                              rounded-[3px] border
                              ${isSelected
                                ? 'border-primary-600 bg-primary-600'
                                : 'border-gray-500 bg-white'}
                            `}
                          >
                            {isSelected && <CheckIcon />}
                          </span>

                          {opt.color && (
                            <span
                              aria-hidden="true"
                              className={`h-[6px] w-[6px] shrink-0 rounded-full ${opt.color}`}
                            />
                          )}

                          <span className="flex-1 truncate">{opt.label}</span>

                          {opt.count !== undefined && (
                            <span className="ml-auto shrink-0 text-xs text-gray-600">
                              ({opt.count})
                            </span>
                          )}
                        </li>
                      );
                    })
                  )}
                </ul>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

export default MultiSelectCombobox;
