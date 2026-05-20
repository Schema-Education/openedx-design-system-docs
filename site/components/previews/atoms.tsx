'use client';

import type { ReactNode } from 'react';
import {
  Alert,
  Annotation,
  Avatar,
  AvatarButton,
  Badge,
  Bubble,
  Chip,
  CloseButton,
  Figure,
  Form,
  Hyperlink,
  Icon,
  IconButton,
  Image,
  MailtoLink,
  ProgressBar,
  ResponsiveEmbed,
  Skeleton,
  Spinner,
  StatefulButton,
  ToggleButton,
  Truncate,
} from '@openedx/paragon';
import { Check, Settings } from '@openedx/paragon/icons';
import { PreviewSlot } from './preview-slot';

export const ATOM_PREVIEWS: Record<string, () => ReactNode> = {
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
    <PreviewSlot width={220}>
      <Alert variant="info">Heads up</Alert>
    </PreviewSlot>
  ),
  ProgressBar: () => (
    <PreviewSlot width={180}>
      <ProgressBar now={60} variant="success" />
    </PreviewSlot>
  ),
  Icon: () => <Icon src={Check} />,
  IconButton: () => <IconButton src={Settings} iconAs={Icon} alt="settings" />,
  Hyperlink: () => (
    <Hyperlink destination="#" target="_self">
      Learn more
    </Hyperlink>
  ),
  CloseButton: () => <CloseButton onClick={() => undefined} />,
  Skeleton: () => (
    <PreviewSlot width={200}>
      <Skeleton height={12} count={3} />
    </PreviewSlot>
  ),
  StatefulButton: () => (
    <StatefulButton
      variant="primary"
      size="sm"
      state="default"
      disabledStates={['pending']}
      labels={{ default: 'Save', pending: 'Saving…', complete: 'Saved' }}
      icons={{}}
    />
  ),
  ToggleButton: () => (
    <ToggleButton
      id="preview-toggle"
      type="checkbox"
      value="1"
      variant="outline-primary"
      size="sm"
      defaultChecked
    >
      Pinned
    </ToggleButton>
  ),
  Annotation: () => <Annotation variant="success">Note</Annotation>,
  Bubble: () => <Bubble>3</Bubble>,
  CheckBox: () => (
    <Form>
      <Form.Checkbox defaultChecked>Option</Form.Checkbox>
    </Form>
  ),
  Code: () => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
      &lt;Button /&gt;
    </code>
  ),
  Image: () => (
    <PreviewSlot width={120} height={72}>
      <Image
        src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 72'%3E%3Crect width='120' height='72' fill='%23dbeafe'/%3E%3Ctext x='60' y='40' font-size='12' fill='%231e3a8a' text-anchor='middle' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E"
        alt="Sample"
        fluid
      />
    </PreviewSlot>
  ),
  InputSelect: () => (
    <PreviewSlot width={160}>
      <Form>
        <Form.Control as="select" defaultValue="b" size="sm">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Form.Control>
      </Form>
    </PreviewSlot>
  ),
  InputText: () => (
    <PreviewSlot width={180}>
      <Form>
        <Form.Control type="text" placeholder="Enter text" size="sm" />
      </Form>
    </PreviewSlot>
  ),
  MailtoLink: () => (
    <MailtoLink to="hello@example.com">Email us</MailtoLink>
  ),
  ResponsiveEmbed: () => (
    <PreviewSlot width={160}>
      <ResponsiveEmbed aspectRatio="16by9">
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-600">
          16:9 embed
        </div>
      </ResponsiveEmbed>
    </PreviewSlot>
  ),
  TextArea: () => (
    <PreviewSlot width={180}>
      <Form>
        <Form.Control as="textarea" rows={2} placeholder="Notes…" />
      </Form>
    </PreviewSlot>
  ),
  Truncate: () => (
    <PreviewSlot width={180}>
      <Truncate lines={1}>
        The quick brown fox jumps over the lazy dog and keeps on going.
      </Truncate>
    </PreviewSlot>
  ),
  AvatarButton: () => (
    <AvatarButton src="" onClick={() => undefined}>
      User
    </AvatarButton>
  ),
  StatusAlert: () => (
    <PreviewSlot width={220}>
      <Alert variant="info" dismissible={false}>
        Status notice
      </Alert>
    </PreviewSlot>
  ),
  Figure: () => (
    <PreviewSlot width={140}>
      <Figure>
        <Image
          src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23fde68a'/%3E%3C/svg%3E"
          alt="Sample"
          fluid
        />
        <figcaption className="mt-1 text-center text-[10px] text-gray-500">
          Caption
        </figcaption>
      </Figure>
    </PreviewSlot>
  ),
};
