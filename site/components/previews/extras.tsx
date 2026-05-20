'use client';

import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  Chip,
  ChipCarousel,
  ColorPicker,
  Dropzone,
  Media,
  Nav,
  OverflowScroll,
  SelectMenu,
  MenuItem,
} from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

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
        items={[<Chip key="a">All</Chip>, <Chip key="n">New</Chip>, <Chip key="p">Popular</Chip>]}
      />
    </PreviewSlot>
  ),
  ColorPicker: () => (
    <PreviewSlot width={180}>
      <ColorPicker
        title="Color"
        colors={[{ name: 'Brand', value: '#D74000' }]}
      />
    </PreviewSlot>
  ),
  Dropzone: () => (
    <PreviewSlot width={200} height={70}>
      <Dropzone onProcessUpload={() => undefined} />
    </PreviewSlot>
  ),
  SelectMenu: () => (
    <SelectMenu defaultMessage="Choose…">
      <MenuItem>Option A</MenuItem>
      <MenuItem>Option B</MenuItem>
    </SelectMenu>
  ),
};
