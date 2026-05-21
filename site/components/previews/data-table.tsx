'use client';

import type { ReactNode } from 'react';
import { Badge, Button, Card as PCard, Icon } from '@openedx/paragon';
import { Check, FilterList, KeyboardArrowLeft, KeyboardArrowRight, Search } from '@openedx/paragon/icons';
import { MockedBadge } from './_shared';

/**
 * DataTable family previews — representative mocks that visually mirror the
 * canonical example on the Paragon docs site (`TableControlBar` + `Table` +
 * `TableFooter` rendered against a small dataset).
 *
 * We can't use Paragon's live `<DataTable>` here because Paragon v23.x's
 * DataTable relies on legacy `defaultProps` for several internal components
 * (TableControlBar, TablePagination, DataViewToggle, ...). React 19 dropped
 * `defaultProps` support for function/forwardRef components, so the live
 * tree crashes with `Cannot read properties of undefined (reading
 * 'togglePlacement')` and downstream `Element type is invalid` errors during
 * render. Until Paragon ships a React-19-compatible release, these mocks
 * keep the registry preview honest about Paragon's intended visual surface.
 */

const ROWS: { name: string; famous_for: string; color: string }[] = [
  { name: 'Lil Bub', famous_for: 'weird tongue', color: 'brown tabby' },
  { name: 'Grumpy Cat', famous_for: 'serving moods', color: 'siamese' },
  { name: 'Smoothie', famous_for: 'modeling', color: 'orange tabby' },
  { name: 'Maru', famous_for: 'lovable oaf', color: 'brown tabby' },
  { name: 'Keyboard Cat', famous_for: 'piano virtuoso', color: 'orange tabby' },
  { name: 'Long Cat', famous_for: 'being long', color: 'russian white' },
  { name: 'Zeno', famous_for: 'getting halfway there', color: 'brown tabby' },
];

function ControlBar({ filtersApplied = 0 }: { filtersApplied?: number }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-3 py-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded border bg-white px-2 py-1 text-xs text-gray-500">
          <Icon src={Search} className="!h-3.5 !w-3.5" />
          <span>Search name</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded border bg-white px-2 py-1 text-xs text-gray-700"
        >
          <Icon src={FilterList} className="!h-3.5 !w-3.5" />
          Filters
          {filtersApplied > 0 && (
            <Badge variant="primary" className="ms-1">
              {filtersApplied}
            </Badge>
          )}
        </button>
      </div>
      <span className="whitespace-nowrap text-[11px] text-gray-500">
        Showing {ROWS.length} of {ROWS.length + 4}.
      </span>
    </div>
  );
}

function TableMarkup({
  selectedIndexes = [],
}: {
  selectedIndexes?: number[];
}) {
  return (
    <table className="table table-sm mb-0 w-full text-xs">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="w-8 px-2 py-1.5">
            <input type="checkbox" />
          </th>
          <th className="px-2 py-1.5 font-semibold text-gray-700">Name</th>
          <th className="px-2 py-1.5 font-semibold text-gray-700">
            Famous For
          </th>
          <th className="px-2 py-1.5 font-semibold text-gray-700">
            Coat Color
          </th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row, i) => (
          <tr
            key={row.name}
            className={selectedIndexes.includes(i) ? 'bg-blue-50' : undefined}
          >
            <td className="px-2 py-1.5">
              <input type="checkbox" defaultChecked={selectedIndexes.includes(i)} />
            </td>
            <td className="px-2 py-1.5">{row.name}</td>
            <td className="px-2 py-1.5">{row.famous_for}</td>
            <td className="px-2 py-1.5">{row.color}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Footer() {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
      <span className="text-[11px] text-gray-500">
        Showing 1 - {ROWS.length} of {ROWS.length + 4}.
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded p-1 text-gray-600 hover:bg-gray-100"
          aria-label="Previous"
        >
          <Icon src={KeyboardArrowLeft} className="!h-4 !w-4" />
        </button>
        <span className="text-[11px] text-gray-700">1 of 3</span>
        <button
          type="button"
          className="rounded p-1 text-gray-600 hover:bg-gray-100"
          aria-label="Next"
        >
          <Icon src={KeyboardArrowRight} className="!h-4 !w-4" />
        </button>
      </div>
    </div>
  );
}

function BulkActions() {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-blue-50 px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <Icon src={Check} className="!h-4 !w-4 text-blue-700" />
        <span className="font-semibold text-blue-900">2 selected</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline-primary" size="sm">
          Archive
        </Button>
        <Button variant="outline-primary" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}

/**
 * Full-bleed wrapper. We bypass `PreviewSlot` here because that helper sizes
 * its inner div to content width, which leaves the DataTable mock floating
 * in the left half of the xxl variant tile. We claim the tile's full width
 * but leave the height to follow content — stretching vertically would force
 * the last row (the footer) to absorb the slack and read as artificially
 * tall.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5 self-start">
      <MockedBadge reason="Paragon v23.x DataTable internals rely on defaultProps; React 19 dropped that pattern." />
      <PCard className="w-full overflow-hidden">{children}</PCard>
    </div>
  );
}

export const DATA_TABLE_PREVIEWS: Record<string, () => ReactNode> = {
  DataTable: () => (
    <Shell>
      <ControlBar />
      <TableMarkup />
      <Footer />
    </Shell>
  ),
  'DataTable.Table': () => (
    <Shell>
      <TableMarkup />
    </Shell>
  ),
  'DataTable.BulkActions': () => (
    <Shell>
      <BulkActions />
      <TableMarkup selectedIndexes={[0, 1]} />
      <Footer />
    </Shell>
  ),
  'DataTable.EmptyTable': () => (
    <Shell>
      <ControlBar filtersApplied={2} />
      <div className="px-6 py-10 text-center text-xs text-gray-500">
        No results found.
      </div>
      <Footer />
    </Shell>
  ),
  'DataTable.TableControlBar': () => (
    <Shell>
      <ControlBar filtersApplied={1} />
    </Shell>
  ),
  'DataTable.TableFilters': () => (
    <Shell>
      <ControlBar filtersApplied={2} />
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 text-xs">
        <span className="text-gray-500">Coat color:</span>
        <Badge variant="primary">brown tabby</Badge>
        <Badge variant="primary">siamese</Badge>
        <button type="button" className="ml-auto text-blue-700 underline">
          Clear all
        </button>
      </div>
      <TableMarkup />
    </Shell>
  ),
  'DataTable.TableFooter': () => (
    <Shell>
      <TableMarkup />
      <Footer />
    </Shell>
  ),
};
