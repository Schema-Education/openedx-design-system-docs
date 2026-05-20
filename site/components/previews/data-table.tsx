'use client';

import type { ReactNode } from 'react';
import { Badge, Card as PCard } from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

/**
 * DataTable family previews — Paragon's <DataTable> requires real columns/data
 * and renders at full width with controls. None of that fits in a 200×128 card
 * thumbnail. Each preview below is a static mock built with Paragon primitives
 * (Card, Badge) and minimal Bootstrap table classes so it visually represents
 * the named member without spinning up a live DataTable instance.
 *
 * Trade-off: previews are not live components — they're representative mocks.
 * Live editing will arrive in Phase 2b (Sandpack).
 */

function MiniTable({ rows = 2 }: { rows?: number }) {
  return (
    <table className="table table-sm mb-0 w-full text-xs">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td>User {i + 1}</td>
            <td>Member</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const DATA_TABLE_PREVIEWS: Record<string, () => ReactNode> = {
  DataTable: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section>
          <MiniTable />
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  'DataTable.Table': () => (
    <PreviewSlot width={220}>
      <MiniTable />
    </PreviewSlot>
  ),
  'DataTable.BulkActions': () => (
    <PreviewSlot width={220}>
      <div className="flex items-center gap-2 rounded border bg-white px-2 py-1.5 text-xs">
        <Badge variant="primary">2 selected</Badge>
        <button type="button" className="text-blue-700 underline">
          Archive
        </button>
        <button type="button" className="text-blue-700 underline">
          Delete
        </button>
      </div>
    </PreviewSlot>
  ),
  'DataTable.EmptyTable': () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section>
          <p className="m-0 text-center text-xs text-gray-500">
            No records to show
          </p>
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  'DataTable.TableControlBar': () => (
    <PreviewSlot width={220}>
      <div className="flex items-center justify-between rounded border bg-white px-2 py-1.5 text-xs">
        <span className="text-gray-700">12 records</span>
        <div className="flex gap-1">
          <Badge variant="light">Filters</Badge>
          <Badge variant="light">Sort</Badge>
        </div>
      </div>
    </PreviewSlot>
  ),
  'DataTable.TableFilters': () => (
    <PreviewSlot width={220}>
      <div className="flex flex-wrap items-center gap-1 rounded border bg-white px-2 py-1.5 text-xs">
        <span className="text-gray-700">Role:</span>
        <Badge variant="primary">Admin</Badge>
        <Badge variant="light">+ Add</Badge>
      </div>
    </PreviewSlot>
  ),
  'DataTable.TableFooter': () => (
    <PreviewSlot width={220}>
      <div className="flex items-center justify-between rounded border bg-white px-2 py-1.5 text-xs">
        <span className="text-gray-700">Showing 1–10 of 24</span>
        <div className="flex gap-1">
          <button type="button" className="text-blue-700">
            ‹
          </button>
          <button type="button" className="text-blue-700">
            ›
          </button>
        </div>
      </div>
    </PreviewSlot>
  ),
};
