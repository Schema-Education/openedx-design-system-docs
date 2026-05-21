'use client';

import type { ReactNode } from 'react';
import {
  Button,
  Card as PCard,
  Carousel,
  CarouselItem,
  Nav,
  Navbar,
  PageBanner,
  Pagination,
  SearchField,
  Stepper,
  Tab,
  Tabs,
} from '@openedx/paragon';
import { PreviewSlot } from './preview-slot';

export const ORGANISM_PREVIEWS: Record<string, () => ReactNode> = {
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
  Stepper: () => (
    <PreviewSlot width={260}>
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
    </PreviewSlot>
  ),
  Tabs: () => (
    <Tabs defaultActiveKey="design" id="preview-tabs">
      <Tab eventKey="design" title="Design" />
      <Tab eventKey="code" title="Code" />
      <Tab eventKey="usage" title="Usage" />
    </Tabs>
  ),
  Carousel: () => (
    <PreviewSlot width={220}>
      <Carousel
        controls={false}
        indicators
        interval={null}
        slide={false}
      >
        <CarouselItem>
          <div className="flex h-16 items-center justify-center rounded bg-blue-100 text-xs text-blue-900">
            Slide 1
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-16 items-center justify-center rounded bg-blue-100 text-xs text-blue-900">
            Slide 2
          </div>
        </CarouselItem>
      </Carousel>
    </PreviewSlot>
  ),
  Navbar: () => (
    <PreviewSlot align="stretch">
      <Navbar bg="light" expand="sm" className="rounded border">
        <Navbar.Brand href="#" className="fw-bold">
          edX
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#" active>
            Courses
          </Nav.Link>
          <Nav.Link href="#">Programs</Nav.Link>
          <Nav.Link href="#">About</Nav.Link>
        </Nav>
        <div className="d-flex align-items-center gap-2">
          <SearchField
            onSubmit={() => undefined}
            placeholder="Search"
            inputProps={{ 'aria-label': 'Search' }}
          />
          <Button variant="primary" size="sm">
            Sign in
          </Button>
        </div>
      </Navbar>
    </PreviewSlot>
  ),
  PageBanner: () => (
    <PreviewSlot width={260}>
      <PageBanner
        variant="accentB"
        show
        dismissible={false}
        dismissAltText="Dismiss"
        onDismiss={() => undefined}
      >
        Heads up
      </PageBanner>
    </PreviewSlot>
  ),
  // "Table" — Paragon doesn't export a bare <Table>; fall back to Card-styled mock
  Table: () => (
    <PreviewSlot width={220}>
      <PCard>
        <PCard.Section>
          <table className="table table-sm mb-0 text-xs">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ada</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td>Lin</td>
                <td>Author</td>
              </tr>
            </tbody>
          </table>
        </PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
};
