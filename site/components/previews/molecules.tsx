'use client';

import type { ReactNode } from 'react';
import {
  ActionRow,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card as PCard,
  Collapsible,
  Dropdown,
  Form,
  FormControlFeedback,
  Icon,
  IconButton,
  IconButtonToggle,
  SearchField,
  SelectableBox,
  ValidationMessage,
} from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { PreviewSlot } from './preview-slot';

/**
 * Molecule previews.
 *
 * Note: some Paragon v23.x components (notably Form.Checkbox and members
 * that rely on `defaultProps.controlAs`) do not render under React 19, which
 * dropped `defaultProps` support for function/forwardRef components. Those
 * previews fall back to native HTML inputs styled to read like the Paragon
 * component until Paragon ships a React-19-compatible release.
 */

export const MOLECULE_PREVIEWS: Record<string, () => ReactNode> = {
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
    <PreviewSlot width={200}>
      <SearchField onSubmit={() => undefined} placeholder="Search…" />
    </PreviewSlot>
  ),
  Toast: () => (
    <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white shadow-md">
      <span>Saved</span>
      <span
        aria-hidden
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none text-white/80"
      >
        ×
      </span>
    </div>
  ),
  Card: () => (
    <PreviewSlot width={200}>
      <PCard>
        <PCard.Section>Card body</PCard.Section>
      </PCard>
    </PreviewSlot>
  ),
  Form: () => (
    <PreviewSlot width={180}>
      <Form>
        <Form.Switch checked onChange={() => undefined}>
          Enabled
        </Form.Switch>
      </Form>
    </PreviewSlot>
  ),
  'Form.Switch': () => (
    <PreviewSlot width={180}>
      <Form>
        <Form.Switch checked onChange={() => undefined}>
          Enabled
        </Form.Switch>
      </Form>
    </PreviewSlot>
  ),
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
  Dropdown: () => (
    <Dropdown>
      <Dropdown.Toggle id="preview-dropdown" variant="outline-primary" size="sm">
        Options
      </Dropdown.Toggle>
    </Dropdown>
  ),
  Collapsible: () => (
    <PreviewSlot width={220}>
      <Collapsible styling="basic" title="Show details" defaultOpen={false}>
        <p className="mb-0 text-xs text-gray-600">Hidden content</p>
      </Collapsible>
    </PreviewSlot>
  ),
  // Form.Checkbox: Paragon's FormCheckbox depends on defaultProps.controlAs,
  // which React 19 no longer applies. Fall back to native checkbox in Form.
  'Form.Checkbox': () => (
    <Form>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" defaultChecked /> Email me updates
      </label>
    </Form>
  ),
  'Form.Radio': () => (
    <Form>
      <Form.Radio name="r" defaultChecked>
        Option A
      </Form.Radio>
    </Form>
  ),
  'Form.Control': () => (
    <PreviewSlot width={180}>
      <Form>
        <Form.Control type="text" placeholder="Type here" />
      </Form>
    </PreviewSlot>
  ),
  'Form.Control.Feedback': () => (
    <PreviewSlot width={200}>
      <Form>
        <Form.Control type="text" defaultValue="hi" isInvalid />
        <FormControlFeedback type="invalid">Required</FormControlFeedback>
      </Form>
    </PreviewSlot>
  ),
  'Form.Label': () => (
    <Form>
      <Form.Label>Email</Form.Label>
    </Form>
  ),
  'Form.Group': () => (
    <PreviewSlot width={200}>
      <Form>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="you@example.com" />
        </Form.Group>
      </Form>
    </PreviewSlot>
  ),
  // Form.Autosuggest also requires React-18 defaultProps semantics; mock for now.
  'Form.Autosuggest': () => (
    <PreviewSlot width={200}>
      <Form>
        <Form.Control type="text" placeholder="Search…" />
        <div className="mt-1 rounded border bg-white text-xs shadow">
          <div className="px-2 py-1 hover:bg-gray-50">Suggestion 1</div>
          <div className="px-2 py-1 hover:bg-gray-50">Suggestion 2</div>
        </div>
      </Form>
    </PreviewSlot>
  ),
  // Form.CheckboxSet / RadioSet inherit the FormCheckbox/FormRadio issue.
  // Mock as a labeled list using native inputs inside <Form>.
  CheckBoxGroup: () => (
    <Form>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" defaultChecked /> A
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" /> B
      </label>
    </Form>
  ),
  RadioButtonGroup: () => (
    <Form>
      <Form.Radio name="rg" value="a" defaultChecked>
        A
      </Form.Radio>
      <Form.Radio name="rg" value="b">
        B
      </Form.Radio>
    </Form>
  ),
  ValidationFormGroup: () => (
    <PreviewSlot width={200}>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" isInvalid />
          <FormControlFeedback type="invalid">Required</FormControlFeedback>
        </Form.Group>
      </Form>
    </PreviewSlot>
  ),
  ValidationMessage: () => (
    <PreviewSlot width={200}>
      <ValidationMessage id="vm" invalidMessage="This field is required" isValid={false} />
    </PreviewSlot>
  ),
  IconButtonToggle: () => (
    <IconButtonToggle activeValue="a" onChange={() => undefined}>
      <IconButton value="a" src={Settings} iconAs={Icon} alt="A" />
      <IconButton value="b" src={Settings} iconAs={Icon} alt="B" />
    </IconButtonToggle>
  ),
  // InputGroup from react-bootstrap also relies on legacy defaultProps in places.
  InputGroup: () => (
    <PreviewSlot width={200}>
      <div className="flex">
        <span className="rounded-l border border-r-0 bg-gray-100 px-2 py-1 text-xs">@</span>
        <Form>
          <Form.Control type="text" placeholder="username" />
        </Form>
      </div>
    </PreviewSlot>
  ),
  SelectableBox: () => (
    <PreviewSlot width={160}>
      <SelectableBox type="checkbox" inputHidden>
        <div className="text-xs">Pick this</div>
      </SelectableBox>
    </PreviewSlot>
  ),
};
