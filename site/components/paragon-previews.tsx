'use client';

import type { ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card as PCard,
  Chip,
  Form,
  Hyperlink,
  Icon,
  IconButton,
  ProgressBar,
  SearchField,
  Spinner,
  Toast,
} from '@openedx/paragon';
import { Check, Settings } from '@openedx/paragon/icons';

export const PARAGON_PREVIEWS: Record<string, () => ReactNode> = {
  Button: () => (
    <Button variant="primary" size="sm">
      Action
    </Button>
  ),
  Badge: () => <Badge variant="success">Stable</Badge>,
  Avatar: () => (
    <Avatar
      size="md"
      alt="User"
      src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%236366f1'/%3E%3Ctext x='24' y='30' font-family='sans-serif' font-size='20' fill='white' text-anchor='middle'%3EU%3C/text%3E%3C/svg%3E"
    />
  ),
  Chip: () => <Chip>Filter</Chip>,
  Spinner: () => <Spinner animation="border" screenReaderText="loading" />,
  Alert: () => (
    <Alert variant="info" className="mb-0 py-2 px-3 text-xs" style={{ maxWidth: 220 }}>
      Heads up
    </Alert>
  ),
  ProgressBar: () => (
    <div style={{ width: 180 }}>
      <ProgressBar now={60} variant="success" />
    </div>
  ),
  Icon: () => <Icon src={Check} />,
  IconButton: () => <IconButton src={Settings} iconAs={Icon} alt="settings" />,
  Hyperlink: () => (
    <Hyperlink destination="#" target="_self">
      Learn more
    </Hyperlink>
  ),
  Breadcrumb: () => (
    <Breadcrumb
      links={[
        { label: 'Home', href: '#' },
        { label: 'Library', href: '#' },
      ]}
      activeLabel="Component"
    />
  ),
  SearchField: () => (
    <div style={{ width: 200 }}>
      <SearchField onSubmit={() => undefined} placeholder="Search…" />
    </div>
  ),
  Toast: () => (
    <Toast onClose={() => undefined} show>
      Saved
    </Toast>
  ),
  Card: () => (
    <div style={{ width: 200 }}>
      <PCard>
        <PCard.Section className="py-2 px-3 text-xs">Card body</PCard.Section>
      </PCard>
    </div>
  ),
  Form: () => (
    <Form style={{ width: 180 }}>
      <Form.Switch checked onChange={() => undefined}>
        Enabled
      </Form.Switch>
    </Form>
  ),
};
