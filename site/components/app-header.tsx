'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Components', href: '/registry', match: (p: string) => p === '/registry' || p.startsWith('/registry/') },
  { label: 'Docs & Vision', href: '/docs', match: (p: string) => p === '/docs' || p.startsWith('/docs/') },
] as const;

const EXTERNAL_LINKS = [
  { label: 'Paragon repo', href: 'https://github.com/openedx/paragon' },
  { label: 'GitHub', href: 'https://github.com/Schema-Education/openedx-design-system-docs' },
] as const;

export function AppHeader() {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055]"
          aria-label="Open edX Design System home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/openedx-logo.svg"
            alt="Open edX"
            width={132}
            height={39}
            className="h-7 w-auto sm:h-8"
          />
          <span className="hidden whitespace-nowrap border-l border-gray-300 pl-3 text-lg font-semibold tracking-tight text-gray-900 md:inline">
            Design System
          </span>
          <span className="hidden rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 md:inline">
            POC
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055]',
                  active
                    ? 'bg-[#0a3055]/10 text-[#0a3055]'
                    : 'text-gray-700 hover:bg-gray-100',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-1 text-xs lg:flex">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055]"
            >
              {link.label} ↗
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="app-header-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055] md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-20 bg-gray-900/30 md:hidden"
          />
          <div
            id="app-header-mobile-menu"
            className="absolute inset-x-0 top-16 z-30 border-b border-gray-200 bg-white shadow-lg md:hidden"
          >
            <nav className="flex flex-col px-4 py-3" aria-label="Primary mobile">
              {TABS.map((tab) => {
                const active = tab.match(pathname);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      'inline-flex h-11 items-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055]',
                      active
                        ? 'bg-[#0a3055]/10 text-[#0a3055]'
                        : 'text-gray-800 hover:bg-gray-100',
                    ].join(' ')}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-1 border-t border-gray-200 px-4 py-3 md:px-6">
              <span className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Resources
              </span>
              {EXTERNAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center rounded-md px-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3055]"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
