/**
 * Gallery data types — superset of RegistryComponent for the
 * proof-of-concept browseable gallery. Mirrors the shape of
 * lib/components.json (seeded from registry/seed-classification.md).
 */

import type { AtomicLevel, A11yLevel } from './registry';

export type FunctionalCategory =
  | 'Action'
  | 'Input'
  | 'Selection'
  | 'Form'
  | 'Navigation'
  | 'Overlay'
  | 'Feedback'
  | 'Status'
  | 'Display'
  | 'Data'
  | 'Media'
  | 'Layout'
  | 'Utility'
  | 'Container';

export type GalleryStatus = 'stable' | 'deprecated' | 'experimental';

export interface GalleryComponent {
  slug: string;
  name: string;
  atomicLevel: AtomicLevel;
  functionalCategory: FunctionalCategory;
  status: GalleryStatus;
  description: string;
  sourceMfe: string;
  sourceRepo: string;
  sourcePath: string;
  version: string;
  figmaCodeConnectUrl: string | null;
  figmaLibraryUrl: string | null;
  consumers: string[];
  a11y: A11yLevel;
  lastIngested: string;
  githubIssuesUrl: string;
}

export const ATOMIC_LEVELS: AtomicLevel[] = [
  'atom',
  'molecule',
  'organism',
  'template',
  'page',
];

export const STATUSES: GalleryStatus[] = ['stable', 'experimental', 'deprecated'];

export const FUNCTIONAL_CATEGORIES: FunctionalCategory[] = [
  'Action',
  'Input',
  'Selection',
  'Form',
  'Navigation',
  'Overlay',
  'Feedback',
  'Status',
  'Display',
  'Data',
  'Media',
  'Layout',
  'Utility',
  'Container',
];

export type GroupBy =
  | 'atomicLevel'
  | 'functionalCategory'
  | 'sourceMfe'
  | 'flat';

export const ATOMIC_LEVEL_META: Record<
  AtomicLevel,
  { label: string; color: string; ring: string; gradient: string; order: number }
> = {
  atom: {
    label: 'Atom',
    color: 'bg-sky-100 text-sky-800',
    ring: 'ring-sky-300',
    gradient: 'from-sky-200 to-sky-400',
    order: 0,
  },
  molecule: {
    label: 'Molecule',
    color: 'bg-emerald-100 text-emerald-800',
    ring: 'ring-emerald-300',
    gradient: 'from-emerald-200 to-emerald-400',
    order: 1,
  },
  organism: {
    label: 'Organism',
    color: 'bg-violet-100 text-violet-800',
    ring: 'ring-violet-300',
    gradient: 'from-violet-200 to-violet-400',
    order: 2,
  },
  template: {
    label: 'Template',
    color: 'bg-amber-100 text-amber-800',
    ring: 'ring-amber-300',
    gradient: 'from-amber-200 to-amber-400',
    order: 3,
  },
  page: {
    label: 'Page',
    color: 'bg-rose-100 text-rose-800',
    ring: 'ring-rose-300',
    gradient: 'from-rose-200 to-rose-400',
    order: 4,
  },
};

export const STATUS_META: Record<
  GalleryStatus,
  { label: string; color: string }
> = {
  stable: { label: 'Stable', color: 'bg-green-100 text-green-800' },
  experimental: {
    label: 'Experimental',
    color: 'bg-yellow-100 text-yellow-800',
  },
  deprecated: { label: 'Deprecated', color: 'bg-gray-200 text-gray-600' },
};
