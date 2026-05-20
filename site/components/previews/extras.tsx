'use client';

import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  Chip,
  ChipCarousel,
  Media,
  MenuItem,
  Nav,
  OverflowScroll,
  SelectMenu,
} from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

/**
 * "Extras" — leftover Paragon components that didn't fit cleanly into the
 * atom/molecule/organism buckets. Most use real Paragon imports. A few
 * (ColorPicker, Dropzone) depend on legacy React 17/18 `defaultProps`
 * semantics that React 19 no longer applies, so they fall back to HTML mocks.
 */

export const EXTRA_PREVIEWS: Record<string, () => ReactNode> = {
  Button: () => (
    <Button variant="primary" size="sm">
      Action
    </Button>
  ),
  Nav: () => (
    <Nav variant="pills" defaultActiveKey="design">
      <Nav.Item>
        <Nav.Link eventKey="design">Design</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="code">Code</Nav.Link>
      </Nav.Item>
    </Nav>
  ),
  Media: () => (
    <PreviewSlot width={220}>
      <Media>
        <Media.Body>
          <strong className="text-xs">Media body</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Description text goes here.
          </p>
        </Media.Body>
      </Media>
    </PreviewSlot>
  ),
  OverflowScroll: () => (
    <PreviewSlot width={220}>
      <OverflowScroll>
        {Array.from({ length: 6 }).map((_, i) => (
          <Badge key={i} variant="light" className="mx-1 whitespace-nowrap">
            Tag {i + 1}
          </Badge>
        ))}
      </OverflowScroll>
    </PreviewSlot>
  ),
  ChipCarousel: () => (
    <PreviewSlot width={220}>
      <ChipCarousel
        ariaLabel="Filters"
        items={[
          <Chip key="a">All</Chip>,
          <Chip key="n">New</Chip>,
          <Chip key="p">Popular</Chip>,
        ]}
      />
    </PreviewSlot>
  ),
  // ColorPicker uses legacy defaultProps; mock as swatches under React 19.
  ColorPicker: () => (
    <PreviewSlot width={180}>
      <div className="flex items-center gap-2 text-xs">
        <span>Color:</span>
        <span
          className="h-4 w-4 rounded border"
          style={{ background: '#D74000' }}
        />
        <span
          className="h-4 w-4 rounded border"
          style={{ background: '#00262B' }}
        />
        <span
          className="h-4 w-4 rounded border"
          style={{ background: '#5DE3BF' }}
        />
      </div>
    </PreviewSlot>
  ),
  // Dropzone also fails under React 19; render a styled drop target instead.
  Dropzone: () => (
    <PreviewSlot width={200} height={70}>
      <div className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-gray-300 text-xs text-gray-500">
        Drag files here
      </div>
    </PreviewSlot>
  ),
  SelectMenu: () => (
    <SelectMenu defaultMessage="Choose…">
      <MenuItem>Option A</MenuItem>
      <MenuItem>Option B</MenuItem>
    </SelectMenu>
  ),
};
