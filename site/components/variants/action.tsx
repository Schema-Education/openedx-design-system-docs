'use client';

import type { ReactNode } from 'react';
import {
  Avatar,
  AvatarButton,
  Button,
  ButtonGroup,
  CloseButton,
  Icon,
  IconButton,
  IconButtonToggle,
  StatefulButton,
} from '@openedx/paragon';
import { Add, Check, Close, Settings, Edit } from '@openedx/paragon/icons';

export type Variant = {
  label: string;
  description?: string;
  render: () => ReactNode;
};

/**
 * Variant catalogues for the "Action" functional category — Button family.
 * Mirrors the variant states documented on the Paragon docs site so the
 * Usage tab can show a horizontal scroller of realistic state coverage.
 */

export const BUTTON_VARIANTS: Variant[] = [
  {
    label: 'Primary',
    render: () => <Button variant="primary">Primary</Button>,
  },
  {
    label: 'Secondary',
    render: () => <Button variant="secondary">Secondary</Button>,
  },
  {
    label: 'Tertiary',
    render: () => <Button variant="tertiary">Tertiary</Button>,
  },
  {
    label: 'Outline primary',
    render: () => <Button variant="outline-primary">Outline</Button>,
  },
  {
    label: 'Brand',
    render: () => <Button variant="brand">Brand</Button>,
  },
  {
    label: 'Success',
    render: () => <Button variant="success">Success</Button>,
  },
  {
    label: 'Danger',
    render: () => <Button variant="danger">Danger</Button>,
  },
  {
    label: 'Link',
    render: () => <Button variant="link">Learn more</Button>,
  },
  {
    label: 'Small',
    description: 'size="sm"',
    render: () => (
      <Button variant="primary" size="sm">
        Small
      </Button>
    ),
  },
  {
    label: 'Large',
    description: 'size="lg"',
    render: () => (
      <Button variant="primary" size="lg">
        Large
      </Button>
    ),
  },
  {
    label: 'Disabled',
    render: () => (
      <Button variant="primary" disabled>
        Disabled
      </Button>
    ),
  },
  {
    label: 'With icon',
    description: 'iconBefore',
    render: () => (
      <Button variant="primary" iconBefore={Add}>
        Add item
      </Button>
    ),
  },
];

export const CLOSE_BUTTON_VARIANTS: Variant[] = [
  {
    label: 'Default',
    render: () => <CloseButton onClick={() => undefined} />,
  },
  {
    label: 'Inside dialog',
    render: () => (
      <div className="flex items-center justify-between rounded border bg-white px-3 py-2 text-xs">
        <span>Dialog title</span>
        <CloseButton onClick={() => undefined} />
      </div>
    ),
  },
];

export const ICON_BUTTON_VARIANTS: Variant[] = [
  {
    label: 'Primary',
    render: () => (
      <IconButton src={Settings} iconAs={Icon} alt="settings" variant="primary" />
    ),
  },
  {
    label: 'Secondary',
    render: () => (
      <IconButton src={Settings} iconAs={Icon} alt="settings" variant="secondary" />
    ),
  },
  {
    label: 'Brand',
    render: () => (
      <IconButton src={Settings} iconAs={Icon} alt="settings" variant="brand" />
    ),
  },
  {
    label: 'Inverse on dark',
    render: () => (
      <div className="rounded bg-gray-900 p-3">
        <IconButton src={Settings} iconAs={Icon} alt="settings" variant="light" />
      </div>
    ),
  },
  {
    label: 'Small',
    render: () => (
      <IconButton src={Settings} iconAs={Icon} alt="settings" size="sm" />
    ),
  },
  {
    label: 'Disabled',
    render: () => (
      <IconButton
        src={Settings}
        iconAs={Icon}
        alt="settings"
        disabled
      />
    ),
  },
  {
    label: 'Active',
    description: 'isActive',
    render: () => (
      <IconButton src={Edit} iconAs={Icon} alt="edit" isActive />
    ),
  },
];

const AVATAR_SRC =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%236366f1'/%3E%3Ctext x='24' y='30' font-family='sans-serif' font-size='20' fill='white' text-anchor='middle'%3EU%3C/text%3E%3C/svg%3E";

export const AVATAR_BUTTON_VARIANTS: Variant[] = [
  {
    label: 'With avatar',
    render: () => (
      <AvatarButton src={AVATAR_SRC} onClick={() => undefined}>
        Account
      </AvatarButton>
    ),
  },
  {
    label: 'Avatar only',
    render: () => (
      <AvatarButton src={AVATAR_SRC} onClick={() => undefined} />
    ),
  },
  {
    label: 'Initials fallback',
    render: () => (
      <div className="flex items-center gap-2">
        <Avatar size="sm" alt="JD" />
        <span className="font-mono text-xs">JD</span>
      </div>
    ),
  },
  {
    label: 'Disabled',
    render: () => (
      <AvatarButton src={AVATAR_SRC} onClick={() => undefined} disabled>
        Account
      </AvatarButton>
    ),
  },
];

export const BUTTON_GROUP_VARIANTS: Variant[] = [
  {
    label: 'Outline group',
    render: () => (
      <ButtonGroup>
        <Button variant="outline-primary">Day</Button>
        <Button variant="outline-primary">Week</Button>
        <Button variant="outline-primary">Month</Button>
      </ButtonGroup>
    ),
  },
  {
    label: 'Solid group',
    render: () => (
      <ButtonGroup>
        <Button variant="primary">Save</Button>
        <Button variant="primary">Save & close</Button>
      </ButtonGroup>
    ),
  },
  {
    label: 'Small size',
    render: () => (
      <ButtonGroup size="sm">
        <Button variant="outline-primary">One</Button>
        <Button variant="outline-primary">Two</Button>
        <Button variant="outline-primary">Three</Button>
      </ButtonGroup>
    ),
  },
  {
    label: 'Mixed actions',
    render: () => (
      <ButtonGroup>
        <Button variant="tertiary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ButtonGroup>
    ),
  },
];

export const ICON_BUTTON_TOGGLE_VARIANTS: Variant[] = [
  {
    label: 'Two options',
    render: () => (
      <IconButtonToggle activeValue="a" onChange={() => undefined}>
        <IconButton value="a" src={Check} iconAs={Icon} alt="A" />
        <IconButton value="b" src={Close} iconAs={Icon} alt="B" />
      </IconButtonToggle>
    ),
  },
  {
    label: 'Three options',
    render: () => (
      <IconButtonToggle activeValue="edit" onChange={() => undefined}>
        <IconButton value="edit" src={Edit} iconAs={Icon} alt="Edit" />
        <IconButton value="settings" src={Settings} iconAs={Icon} alt="Settings" />
        <IconButton value="close" src={Close} iconAs={Icon} alt="Close" />
      </IconButtonToggle>
    ),
  },
];

export const STATEFUL_BUTTON_VARIANTS: Variant[] = [
  {
    label: 'Default state',
    render: () => (
      <StatefulButton
        variant="primary"
        state="default"
        disabledStates={['pending']}
        labels={{ default: 'Save', pending: 'Saving…', complete: 'Saved' }}
        icons={{ complete: Check }}
      />
    ),
  },
  {
    label: 'Pending state',
    render: () => (
      <StatefulButton
        variant="primary"
        state="pending"
        disabledStates={['pending']}
        labels={{ default: 'Save', pending: 'Saving…', complete: 'Saved' }}
        icons={{ complete: Check }}
      />
    ),
  },
  {
    label: 'Complete state',
    render: () => (
      <StatefulButton
        variant="primary"
        state="complete"
        disabledStates={['pending']}
        labels={{ default: 'Save', pending: 'Saving…', complete: 'Saved' }}
        icons={{ complete: Check }}
      />
    ),
  },
  {
    label: 'Secondary variant',
    render: () => (
      <StatefulButton
        variant="outline-primary"
        state="default"
        disabledStates={['pending']}
        labels={{ default: 'Subscribe', pending: 'Working…', complete: 'Subscribed' }}
        icons={{}}
      />
    ),
  },
];
