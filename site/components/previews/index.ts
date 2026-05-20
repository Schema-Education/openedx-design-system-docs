import type { ReactNode } from 'react';
import { ATOM_PREVIEWS } from './atoms';
import { MOLECULE_PREVIEWS } from './molecules';
import { ORGANISM_PREVIEWS } from './organisms';
import { DATA_TABLE_PREVIEWS } from './data-table';
import { OVERLAY_PREVIEWS } from './overlays';
import { LAYOUT_PREVIEWS } from './layout';
import { EXTRA_PREVIEWS } from './extras';

export const PARAGON_PREVIEWS: Record<string, () => ReactNode> = {
  ...ATOM_PREVIEWS,
  ...MOLECULE_PREVIEWS,
  ...ORGANISM_PREVIEWS,
  ...DATA_TABLE_PREVIEWS,
  ...OVERLAY_PREVIEWS,
  ...LAYOUT_PREVIEWS,
  ...EXTRA_PREVIEWS,
};
