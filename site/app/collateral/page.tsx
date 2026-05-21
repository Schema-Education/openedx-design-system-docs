import type { Metadata } from 'next';
import { AppHeader } from '@/components/app-header';

export const metadata: Metadata = {
  title: 'Shared Design Collateral',
  description:
    'Canonical Open edX design collateral — the Confluence reference docs and the Figma source files that the Shared Design Collateral effort coordinates around. Mirrors https://linktr.ee/openedx_designs.',
};

type LinkKind = 'wiki' | 'figma';

interface CollateralLink {
  emoji: string;
  title: string;
  href: string;
  kind: LinkKind;
  /** Short helper line under the title for context. */
  blurb: string;
}

const KIND_META: Record<LinkKind, { label: string; tagClass: string; iconBgClass: string }> = {
  wiki: {
    label: 'Confluence',
    tagClass: 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200',
    iconBgClass: 'bg-blue-50 ring-1 ring-inset ring-blue-100',
  },
  figma: {
    label: 'Figma',
    tagClass: 'bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200',
    iconBgClass: 'bg-violet-50 ring-1 ring-inset ring-violet-100',
  },
};

// Mirror of https://linktr.ee/openedx_designs (link order preserved).
// Captured 2026-05-21. Update via the script in /tmp/perf-audit/ or refresh
// manually when the Linktree is updated.
//
// NOTE on the Instructor Dashboard URL: the Linktree source has the URL
// pasted twice end-to-end (a content-author typo). The valid half is the
// first occurrence; this list uses that.
const COLLATERAL: CollateralLink[] = [
  {
    emoji: '📜',
    title: 'Open edX Shared Design Collateral',
    href: 'https://openedx.atlassian.net/wiki/spaces/BPL/pages/6164414467/Open+edX+Shared+Design+Collateral',
    kind: 'wiki',
    blurb: 'Design System Documentation — the canonical wiki page that catalogues this collateral.',
  },
  {
    emoji: '💎',
    title: 'Paragon Design System',
    href: 'https://www.figma.com/community/file/1613557968143483477/open-edx-paragon-design-system-v-alpha-0-1',
    kind: 'figma',
    blurb: 'Source library for the Paragon component set used across MFEs.',
  },
  {
    emoji: '📝',
    title: 'Authoring Experience',
    href: 'https://www.figma.com/design/rb7zssb2vCo7KeC1ipL4Tv/Library---Course-Authoring-v1.0',
    kind: 'figma',
    blurb: 'Course authoring (Studio) v1.0 — designs for the educator-facing toolchain.',
  },
  {
    emoji: '💻',
    title: 'Instructor Dashboard',
    href: 'https://www.figma.com/design/KEFAQYu7Goy8O9Og6meivS/Instructor-Experience-v1.0',
    kind: 'figma',
    blurb: 'Instructor Experience v1.0 — course management, gradebook, and operations surfaces.',
  },
  {
    emoji: '🎓',
    title: 'Learner Experience',
    href: 'https://www.figma.com/design/4YIdnGh4NnxxGAXcL9ekXY/-Open-edX--Learner-Experience-v_Alpha-0.1',
    kind: 'figma',
    blurb: 'Learner Experience v_Alpha 0.1 — dashboard, course-home, and unit-level patterns.',
  },
  {
    emoji: '📱',
    title: 'Open edX Mobile',
    href: 'https://www.figma.com/design/TzgY7FkiUGTakd9RxL7yDv/Mobile-App-v2.5-Open-edX',
    kind: 'figma',
    blurb: 'Mobile App v2.5 — native learner experience designs.',
  },
  {
    emoji: '📋',
    title: '[Proposal] Open edX Shared Design Collateral',
    href: 'https://openedx.atlassian.net/wiki/spaces/COMM/pages/5028052994/Proposal+Open+edX+Shared+Design+Collateral',
    kind: 'wiki',
    blurb: 'Open edX Community proposal that established this collateral initiative.',
  },
];

export default function CollateralPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />
      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-500">
          Tool · Shared Design Collateral
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Shared Design Collateral
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The Confluence reference docs and Figma source files that the Open edX
          community uses as canonical design collateral.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Mirrors{' '}
          <a
            href="https://linktr.ee/openedx_designs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline-offset-2 hover:underline"
          >
            linktr.ee/openedx_designs
          </a>{' '}
          — surfacing the same links inside the design-system docs site so
          they're one click from the registry and the vision.
        </p>
      </section>

      {/* Links grid */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <ul className="grid grid-cols-1 gap-3">
          {COLLATERAL.map((link) => (
            <li key={link.href}>
              <CollateralCard link={link} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function CollateralCard({ link }: { link: CollateralLink }) {
  const meta = KIND_META[link.kind];
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-gray-200 bg-white p-5 no-underline shadow-sm transition hover:border-primary-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-2xl ${meta.iconBgClass}`}
        >
          {link.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary-700">
              {link.title}
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${meta.tagClass}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{link.blurb}</p>
          <p className="mt-2 truncate font-mono text-[11px] text-gray-400">
            {prettyHost(link.href)}
          </p>
        </div>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary-500"
        >
          ↗
        </span>
      </div>
    </a>
  );
}

function prettyHost(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
    return path ? `${u.host}/${path}…` : u.host;
  } catch {
    return url;
  }
}
