/**
 * Component variant catalogues consumed by the registry's Usage tab.
 *
 * Each entry maps a component name (matching `components.json`) to an ordered
 * list of `Variant` cards. The Usage tab renders these as a horizontal-scroll
 * row of tiles. Components without an entry fall back to the default
 * "Hover / Active / Disabled" placeholder set.
 *
 * Variants mirror the state matrices documented on the Paragon docs site so a
 * consumer browsing the registry sees the same realistic state coverage they
 * would on paragon.openedx.org without round-tripping.
 */
import {
  AVATAR_BUTTON_VARIANTS,
  BUTTON_GROUP_VARIANTS,
  BUTTON_VARIANTS,
  CLOSE_BUTTON_VARIANTS,
  ICON_BUTTON_TOGGLE_VARIANTS,
  ICON_BUTTON_VARIANTS,
  STATEFUL_BUTTON_VARIANTS,
  type Variant,
} from './action';
import { CARD_VARIANTS, COLLAPSIBLE_VARIANTS } from './container';

export type { Variant };

export const COMPONENT_VARIANTS: Record<string, Variant[]> = {
  // Action — Button family
  Button: BUTTON_VARIANTS,
  CloseButton: CLOSE_BUTTON_VARIANTS,
  IconButton: ICON_BUTTON_VARIANTS,
  AvatarButton: AVATAR_BUTTON_VARIANTS,
  ButtonGroup: BUTTON_GROUP_VARIANTS,
  IconButtonToggle: ICON_BUTTON_TOGGLE_VARIANTS,
  StatefulButton: STATEFUL_BUTTON_VARIANTS,
  // Container
  Card: CARD_VARIANTS,
  Collapsible: COLLAPSIBLE_VARIANTS,
};
