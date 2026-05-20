'use client';

import {
  Badge,
  Button,
  Card,
  Collapsible,
} from '@openedx/paragon';
import type { Variant } from './action';

const CARD_IMAGE_SRC =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 80'%3E%3Crect width='220' height='80' fill='%23818cf8'/%3E%3Ctext x='110' y='46' font-family='sans-serif' font-size='14' fill='white' text-anchor='middle'%3EHero image%3C/text%3E%3C/svg%3E";

export const CARD_VARIANTS: Variant[] = [
  {
    label: 'Default vertical',
    render: () => (
      <Card>
        <Card.Section>
          <strong className="text-xs">Card title</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Vertical orientation, default light variant.
          </p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'With image cap',
    render: () => (
      <Card>
        <Card.ImageCap src={CARD_IMAGE_SRC} srcAlt="Hero" />
        <Card.Section>
          <strong className="text-xs">With image cap</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Hero image above body.
          </p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'Horizontal',
    render: () => (
      <Card orientation="horizontal">
        <Card.ImageCap src={CARD_IMAGE_SRC} srcAlt="Hero" />
        <Card.Section>
          <strong className="text-xs">Horizontal</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Image alongside body.
          </p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'Muted variant',
    render: () => (
      <Card variant="muted">
        <Card.Section>
          <strong className="text-xs">Muted card</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Lower-emphasis surface.
          </p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'Dark variant',
    render: () => (
      <Card variant="dark">
        <Card.Section>
          <strong className="text-xs text-white">Dark card</strong>
          <p className="m-0 text-[11px] text-gray-300">High-emphasis dark surface.</p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'Clickable',
    render: () => (
      <Card isClickable>
        <Card.Section>
          <strong className="text-xs">Clickable card</strong>
          <p className="m-0 text-[11px] text-gray-600">
            Focusable surface with hover/focus rings.
          </p>
        </Card.Section>
      </Card>
    ),
  },
  {
    label: 'Header + footer',
    render: () => (
      <Card>
        <Card.Header
          title="Header"
          subtitle="Subtitle"
          actions={
            <Button variant="primary" size="sm">
              Action
            </Button>
          }
        />
        <Card.Section>
          <p className="m-0 text-[11px] text-gray-600">Body content.</p>
        </Card.Section>
        <Card.Footer>
          <Badge variant="success">Status</Badge>
        </Card.Footer>
      </Card>
    ),
  },
  {
    label: 'Loading',
    render: () => (
      <Card isLoading>
        <Card.Section>
          <strong className="text-xs">Loading…</strong>
        </Card.Section>
      </Card>
    ),
  },
];

export const COLLAPSIBLE_VARIANTS: Variant[] = [
  {
    label: 'Basic — closed',
    render: () => (
      <Collapsible styling="basic" title="Show details" defaultOpen={false}>
        <p className="mb-0 text-xs text-gray-600">Hidden content</p>
      </Collapsible>
    ),
  },
  {
    label: 'Basic — open',
    render: () => (
      <Collapsible styling="basic" title="Show details" defaultOpen>
        <p className="mb-0 text-xs text-gray-600">Visible content</p>
      </Collapsible>
    ),
  },
  {
    label: 'Card styling',
    render: () => (
      <Collapsible styling="card" title="Card-styled collapsible" defaultOpen={false}>
        <p className="mb-0 text-xs text-gray-600">Body content goes here.</p>
      </Collapsible>
    ),
  },
  {
    label: 'Card-lg styling',
    render: () => (
      <Collapsible
        styling="card-lg"
        title="Large card style"
        defaultOpen={false}
      >
        <p className="mb-0 text-xs text-gray-600">Body content goes here.</p>
      </Collapsible>
    ),
  },
];
