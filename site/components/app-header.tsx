'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Components', href: '/registry', match: (p: string) => p === '/registry' || p.startsWith('/registry/') },
  { label: 'Docs & Vision', href: '/docs', match: (p: string) => p === '/docs' || p.startsWith('/docs/') },
] as const;

export function AppHeader() {
  const pathname = usePathname() ?? '';

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1650px] items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Open edX Design System home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/openedx-logo.svg"
            alt="Open edX"
            width={132}
            height={39}
            className="h-8 w-auto"
          />
          <span className="hidden border-l border-gray-300 pl-3 text-lg font-semibold tracking-tight text-gray-900 sm:inline">
            Design System
          </span>
          <span className="hidden rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 sm:inline">
            POC
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative inline-flex h-16 items-center px-3 text-sm font-medium transition-colors',
                  active
                    ? 'text-[#0a3055]'
                    : 'text-gray-600 hover:text-gray-900',
                ].join(' ')}
              >
                {tab.label}
                <span
                  aria-hidden
                  className={[
                    'absolute inset-x-3 bottom-0 h-0.5 rounded-t',
                    active ? 'bg-[#0a3055]' : 'bg-transparent',
                  ].join(' ')}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-xs">
          <a
            href="https://github.com/openedx/paragon"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-gray-900"
          >
            Paragon repo ↗
          </a>
          <a
            href="https://github.com/Schema-Education/openedx-design-system-docs"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-gray-900"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}
