'use client';

import { useState, useEffect } from 'react';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';

interface ComponentDetailProps {
  component: GalleryComponent | null;
  onClose: () => void;
  onSelectConsumer?: (mfe: string) => void;
}

type Tab = 'overview' | 'metadata' | 'source' | 'figma' | 'consumers' | 'issues';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'source', label: 'Source' },
  { id: 'figma', label: 'Figma' },
  { id: 'consumers', label: 'Consumers' },
  { id: 'issues', label: 'Issues' },
];

export function ComponentDetail({
  component,
  onClose,
  onSelectConsumer,
}: ComponentDetailProps) {
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    setTab('overview');
  }, [component?.slug]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (component) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [component, onClose]);

  const open = component !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xl transform flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {component && <DetailBody component={component} tab={tab} setTab={setTab} onClose={onClose} onSelectConsumer={onSelectConsumer} />}
      </aside>
    </>
  );
}

function DetailBody({
  component,
  tab,
  setTab,
  onClose,
  onSelectConsumer,
}: {
  component: GalleryComponent;
  tab: Tab;
  setTab: (t: Tab) => void;
  onClose: () => void;
  onSelectConsumer?: (mfe: string) => void;
}) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];

  return (
    <>
      {/* Header */}
      <div className={`bg-gradient-to-br ${atomic.gradient} px-6 py-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
              >
                {atomic.label}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.color}`}
              >
                {status.label}
              </span>
              {component.a11y && (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                  WCAG {component.a11y}
                </span>
              )}
            </div>
            <h2 className="mt-2 font-mono text-2xl font-bold text-white drop-shadow-sm">
              {component.name}
            </h2>
            <p className="mt-1 text-sm text-white/90">{component.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/30 p-1.5 text-white hover:bg-white/50"
            aria-label="Close"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 overflow-x-auto border-b border-gray-200 bg-gray-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium transition ${
              tab === t.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 text-sm">
        {tab === 'overview' && <OverviewTab c={component} />}
        {tab === 'metadata' && <MetadataTab c={component} />}
        {tab === 'source' && <SourceTab c={component} />}
        {tab === 'figma' && <FigmaTab c={component} />}
        {tab === 'consumers' && <ConsumersTab c={component} onSelect={onSelectConsumer} />}
        {tab === 'issues' && <IssuesTab c={component} />}
      </div>
    </>
  );
}

function OverviewTab({ c }: { c: GalleryComponent }) {
  return (
    <div className="space-y-5">
      <KV label="Category" value={c.functionalCategory} />
      <KV label="Source" value={`${c.sourceMfe} (${c.version})`} />
      <KV label="Last ingested" value={new Date(c.lastIngested).toLocaleDateString()} />
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Quick links</div>
        <div className="flex flex-wrap gap-2">
          <ExternalChip href={`https://github.com/${c.sourceRepo}`} label="GitHub repo" />
          <ExternalChip href={c.githubIssuesUrl} label="Issues" />
          {c.figmaCodeConnectUrl && <ExternalChip href={c.figmaCodeConnectUrl} label="Figma Code Connect" />}
          {c.figmaLibraryUrl && <ExternalChip href={c.figmaLibraryUrl} label="Figma Library" />}
        </div>
      </div>
      {c.status === 'deprecated' && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          This component is <strong>deprecated</strong>. See the description above for the recommended replacement.
        </div>
      )}
    </div>
  );
}

function MetadataTab({ c }: { c: GalleryComponent }) {
  const rows: [string, string][] = [
    ['name', c.name],
    ['slug', c.slug],
    ['atomicLevel', c.atomicLevel],
    ['functionalCategory', c.functionalCategory],
    ['status', c.status],
    ['sourceMfe', c.sourceMfe],
    ['sourceRepo', c.sourceRepo],
    ['sourcePath', c.sourcePath],
    ['version', c.version],
    ['a11y', c.a11y ?? '—'],
    ['consumers', c.consumers.length ? c.consumers.join(', ') : '—'],
    ['figmaCodeConnectUrl', c.figmaCodeConnectUrl ?? '—'],
    ['figmaLibraryUrl', c.figmaLibraryUrl ?? '—'],
    ['lastIngested', c.lastIngested],
  ];
  return (
    <table className="w-full text-xs">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-gray-100 last:border-0">
            <td className="py-2 pr-4 align-top font-mono text-gray-500">{k}</td>
            <td className="py-2 break-all text-gray-800">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SourceTab({ c }: { c: GalleryComponent }) {
  const fileUrl = `https://github.com/${c.sourceRepo}/blob/main/${c.sourcePath}`;
  return (
    <div className="space-y-4">
      <KV label="Repository" value={c.sourceRepo} />
      <KV label="Path" value={c.sourcePath} mono />
      <KV label="Version" value={c.version} />
      <div className="flex flex-wrap gap-2">
        <ExternalChip href={fileUrl} label="Open file on GitHub" />
        <ExternalChip href={`https://github.com/${c.sourceRepo}`} label="Repository" />
      </div>
      <div className="rounded-md bg-gray-50 p-3 font-mono text-[11px] text-gray-700">
        {/* Placeholder code snippet */}
        <div className="text-gray-400">// Usage placeholder — populated by Phase 2a crawler</div>
        <div className="mt-1">import &#123; {c.name} &#125; from &apos;@openedx/{c.sourceMfe === 'paragon' ? 'paragon' : c.sourceMfe}&apos;;</div>
      </div>
    </div>
  );
}

function FigmaTab({ c }: { c: GalleryComponent }) {
  const hasFigma = c.figmaCodeConnectUrl || c.figmaLibraryUrl;
  return (
    <div className="space-y-4">
      {hasFigma ? (
        <>
          {c.figmaCodeConnectUrl && <KV label="Code Connect" value={c.figmaCodeConnectUrl} mono />}
          {c.figmaLibraryUrl && <KV label="Library file" value={c.figmaLibraryUrl} mono />}
          <div className="flex flex-wrap gap-2">
            {c.figmaCodeConnectUrl && <ExternalChip href={c.figmaCodeConnectUrl} label="Open in Figma" />}
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-xs text-gray-500">
          <p className="font-medium text-gray-700">No Figma link yet</p>
          <p className="mt-1">
            Figma Code Connect URLs will be populated in Phase 2b. See ADR-0002 for the integration plan.
          </p>
        </div>
      )}
    </div>
  );
}

function ConsumersTab({
  c,
  onSelect,
}: {
  c: GalleryComponent;
  onSelect?: (mfe: string) => void;
}) {
  if (c.consumers.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700">No recorded consumers</p>
        <p className="mt-1">
          {c.sourceMfe === 'paragon'
            ? 'Consumer graph will be populated by the dependency crawler (Phase 2a).'
            : 'This is an MFE-level component — it is consumed by its own page routes.'}
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs text-gray-500">
        {c.consumers.length} MFE{c.consumers.length === 1 ? '' : 's'} import this component:
      </p>
      <ul className="space-y-1.5">
        {c.consumers.map((mfe) => (
          <li key={mfe}>
            <button
              type="button"
              onClick={() => onSelect?.(mfe)}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left text-xs font-mono text-gray-800 hover:border-gray-400 hover:bg-gray-50"
            >
              <span>{mfe}</span>
              <span className="text-gray-400">filter →</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IssuesTab({ c }: { c: GalleryComponent }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600">
        GitHub issues mentioning <code className="rounded bg-gray-100 px-1">{c.name}</code> in{' '}
        <code className="rounded bg-gray-100 px-1">{c.sourceRepo}</code>:
      </p>
      <a
        href={c.githubIssuesUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
      >
        Open issue search on GitHub
        <span aria-hidden>↗</span>
      </a>
      <div className="rounded-md border border-dashed border-gray-300 p-4 text-xs text-gray-500">
        Live issue counts via the GitHub API will land in Phase 2b. For now this links to a pre-filtered search.
      </div>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-0.5 break-all text-sm text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}

function ExternalChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50"
    >
      {label} <span aria-hidden>↗</span>
    </a>
  );
}
