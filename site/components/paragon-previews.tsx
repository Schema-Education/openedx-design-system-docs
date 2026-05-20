'use client';

import type { ReactNode } from 'react';
import {
  ActionRow,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card as PCard,
  Chip,
  CloseButton,
  Collapsible,
  Dropdown,
  Form,
  Hyperlink,
  Icon,
  IconButton,
  Pagination,
  ProgressBar,
  SearchField,
  Skeleton,
  Spinner,
  StatefulButton,
  Stepper,
  Tab,
  Tabs,
  Toast,
  ToggleButton,
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
  'Form.Switch': () => (
    <Form style={{ width: 180 }}>
      <Form.Switch checked onChange={() => undefined}>
        Enabled
      </Form.Switch>
    </Form>
  ),
  CloseButton: () => <CloseButton onClick={() => undefined} />,
  ButtonGroup: () => (
    <ButtonGroup size="sm">
      <Button variant="outline-primary">Day</Button>
      <Button variant="outline-primary">Week</Button>
      <Button variant="outline-primary">Month</Button>
    </ButtonGroup>
  ),
  ActionRow: () => (
    <ActionRow>
      <Button variant="tertiary" size="sm">
        Cancel
      </Button>
      <Button variant="primary" size="sm">
        Confirm
      </Button>
    </ActionRow>
  ),
  Skeleton: () => (
    <div style={{ width: 200 }}>
      <Skeleton height={12} count={3} />
    </div>
  ),
  Stepper: () => (
    <div style={{ width: 260 }}>
      <Stepper activeKey="review">
        <Stepper.Step eventKey="setup" title="Setup" />
        <Stepper.Step eventKey="review" title="Review" />
        <Stepper.Step eventKey="done" title="Done" />
        <Stepper.Header
          PageCountComponent={({
            activeStepIndex,
            totalSteps,
          }: {
            activeStepIndex: number;
            totalSteps: number;
          }) => <>{`Step ${activeStepIndex + 1} of ${totalSteps}`}</>}
        />
      </Stepper>
    </div>
  ),
  Pagination: () => (
    <Pagination
      paginationLabel="preview"
      pageCount={5}
      currentPage={2}
      onPageSelect={() => undefined}
      variant="reduced"
      size="small"
      icons={{
        leftIcon: undefined,
        rightIcon: undefined,
      }}
      buttonLabels={{
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        currentPage: 'Current page',
        pageOfCount: 'of',
      }}
    />
  ),
  Dropdown: () => (
    <Dropdown>
      <Dropdown.Toggle id="preview-dropdown" variant="outline-primary" size="sm">
        Options
      </Dropdown.Toggle>
    </Dropdown>
  ),
  Collapsible: () => (
    <div style={{ width: 220 }}>
      <Collapsible styling="basic" title="Show details" defaultOpen={false}>
        <p className="mb-0 text-xs text-gray-600">Hidden content</p>
      </Collapsible>
    </div>
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
  Tabs: () => (
    <Tabs defaultActiveKey="design" id="preview-tabs">
      <Tab eventKey="design" title="Design" />
      <Tab eventKey="code" title="Code" />
      <Tab eventKey="usage" title="Usage" />
    </Tabs>
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
};
