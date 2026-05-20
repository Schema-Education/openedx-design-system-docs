'use client';

import type { ReactNode } from 'react';
import {
  Badge,
  Collapse,
  Container,
  Fade,
  Layout,
  Scrollable,
  Stack,
  Sticky,
  TransitionReplace,
} from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

export const LAYOUT_PREVIEWS: Record<string, () => ReactNode> = {
  Container: () => (
    <PreviewSlot width={220}>
      <Container className="rounded border bg-gray-50 p-2">
        <div className="flex gap-2">
          <Badge variant="primary">A</Badge>
          <Badge variant="primary">B</Badge>
          <Badge variant="primary">C</Badge>
        </div>
      </Container>
    </PreviewSlot>
  ),
  Layout: () => (
    <PreviewSlot width={220}>
      <Layout
        lg={[{ span: 8 }, { span: 4 }]}
        md={[{ span: 8 }, { span: 4 }]}
        sm={[{ span: 12 }, { span: 12 }]}
        xs={[{ span: 12 }, { span: 12 }]}
      >
        <div className="rounded bg-blue-100 px-2 py-1 text-[11px] text-blue-900">
          Main
        </div>
        <div className="rounded bg-blue-50 px-2 py-1 text-[11px] text-blue-900">
          Aside
        </div>
      </Layout>
    </PreviewSlot>
  ),
  Stack: () => (
    <PreviewSlot width={180}>
      <Stack gap={2}>
        <Badge variant="success">One</Badge>
        <Badge variant="success">Two</Badge>
        <Badge variant="success">Three</Badge>
      </Stack>
    </PreviewSlot>
  ),
  Collapse: () => (
    <PreviewSlot width={200}>
      <Collapse in>
        <div className="rounded bg-gray-100 p-2 text-[11px]">
          Collapsible content (open)
        </div>
      </Collapse>
    </PreviewSlot>
  ),
  Fade: () => (
    <PreviewSlot width={200}>
      <Fade in appear>
        <div className="rounded bg-gray-100 p-2 text-[11px]">
          Faded-in content
        </div>
      </Fade>
    </PreviewSlot>
  ),
  TransitionReplace: () => (
    <PreviewSlot width={200}>
      <TransitionReplace>
        <div key="active" className="rounded bg-gray-100 p-2 text-[11px]">
          Active panel
        </div>
      </TransitionReplace>
    </PreviewSlot>
  ),
  Scrollable: () => (
    <PreviewSlot width={200} height={70}>
      <Scrollable>
        <div className="space-y-1 p-2 text-[11px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded bg-gray-100 px-2 py-1">
              Row {i + 1}
            </div>
          ))}
        </div>
      </Scrollable>
    </PreviewSlot>
  ),
  Sticky: () => (
    <PreviewSlot width={200}>
      <Sticky offset={0}>
        <div className="rounded bg-yellow-100 p-2 text-[11px] text-yellow-900">
          Sticky header
        </div>
      </Sticky>
    </PreviewSlot>
  ),
};
