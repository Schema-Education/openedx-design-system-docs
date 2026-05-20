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
  InputGroup,
  SearchField,
  SelectableBox,
  Toast,
  ValidationMessage,
} from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { PreviewSlot } from './preview-slot';

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
    <Toast onClose={() => undefined} show>
      Saved
    </Toast>
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
  // Form members
  'Form.Checkbox': () => (
    <Form>
      <Form.Checkbox defaultChecked>Email me updates</Form.Checkbox>
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
  'Form.Autosuggest': () => (
    <PreviewSlot width={200}>
      <Form>
        <Form.Autosuggest name="suggest" placeholder="Search…" />
      </Form>
    </PreviewSlot>
  ),
  CheckBoxGroup: () => (
    <Form>
      <Form.CheckboxSet name="opts" defaultValue={['a']}>
        <Form.Checkbox value="a">A</Form.Checkbox>
        <Form.Checkbox value="b">B</Form.Checkbox>
      </Form.CheckboxSet>
    </Form>
  ),
  RadioButtonGroup: () => (
    <Form>
      <Form.RadioSet name="opts" defaultValue="a">
        <Form.Radio value="a">A</Form.Radio>
        <Form.Radio value="b">B</Form.Radio>
      </Form.RadioSet>
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
  InputGroup: () => (
    <PreviewSlot width={200}>
      <InputGroup>
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control placeholder="username" />
      </InputGroup>
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
