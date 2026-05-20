'use client';

import { useEffect } from 'react';
import {
  ATOMIC_LEVEL_META,
  STATUS_META,
  type GalleryComponent,
} from '@/lib/gallery';
import { UsageTab } from './component-usage';

export type DetailTab = 'overview' | 'usage' | 'metadata' | 'issues';

interface ComponentDetailProps {
  component: GalleryComponent | null;
  tab: DetailTab;
  onTabChange: (t: DetailTab) => void;
  onClose: () => void;
  onSelectConsumer?: (mfe: string) => void;
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'usage', label: 'Usage' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'issues', label: 'Issues' },
];

export function ComponentDetail({
  component,
  tab,
  onTabChange,
  onClose,
  onSelectConsumer,
}: ComponentDetailProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (component) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [component, onClose]);

  if (!component) return null;

  return (
    <aside
      className="flex flex-col bg-white"
      aria-label={`${component.name} details`}
    >
      <DetailBody
        component={component}
        tab={tab}
        setTab={onTabChange}
        onClose={onClose}
        onSelectConsumer={onSelectConsumer}
      />
    </aside>
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
  tab: DetailTab;
  setTab: (t: DetailTab) => void;
  onClose: () => void;
  onSelectConsumer?: (mfe: string) => void;
}) {
  const atomic = ATOMIC_LEVEL_META[component.atomicLevel];
  const status = STATUS_META[component.status];

  return (
    <>
      {/* Header — gradient with title + tabs inside */}
      <div className={`bg-gradient-to-br ${atomic.gradient}`}>
        <div className="px-4 pb-3 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span
                  className={`rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${atomic.color}`}
                >
                  {atomic.label}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${status.color}`}
                >
                  {status.label}
                </span>
                {component.a11y && (
                  <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-blue-800">
                    WCAG {component.a11y}
                  </span>
                )}
              </div>
              <h2 className="mt-1.5 font-mono text-xl font-bold text-gray-900">
                {component.name}
              </h2>
              <p className="mt-1 text-xs text-gray-900/80">{component.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full bg-white/80 p-1 text-gray-900 hover:bg-white"
              aria-label="Close"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs — spread evenly within the gradient header; dark text meets AA (≥4.5:1) against every atomic gradient */}
        <div role="tablist" className="flex">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 border-b-2 px-2 py-2 text-center text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white ${
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-800/70 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content. Padding widens when the pane has been expanded to
          host the long-form "Usage" content so it doesn't sit edge-to-edge. */}
      <div
        className={`flex-1 overflow-y-auto py-4 text-sm ${
          tab === 'usage' ? 'px-6' : 'px-4'
        }`}
      >
        {tab === 'overview' && (
          <OverviewTab c={component} onSelectConsumer={onSelectConsumer} />
        )}
        {tab === 'usage' && <UsageTab c={component} />}
        {tab === 'metadata' && <MetadataTab c={component} />}
        {tab === 'issues' && <IssuesTab c={component} />}
      </div>
    </>
  );
}

function OverviewTab({
  c,
  onSelectConsumer,
}: {
  c: GalleryComponent;
  onSelectConsumer?: (mfe: string) => void;
}) {
  const fileUrl = `https://github.com/${c.sourceRepo}/blob/main/${c.sourcePath}`;
  const hasFigma = c.figmaCodeConnectUrl || c.figmaLibraryUrl;
  const importPkg = c.sourceMfe === 'paragon' ? 'paragon' : c.sourceMfe;

  return (
    <div className="space-y-3">
      {/* Preview frame */}
      <ComponentPreview c={c} />

      {/* Deprecation banner */}
      {c.status === 'deprecated' && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-[11px] text-gray-700">
          This component is <strong>deprecated</strong>. See the description above for the recommended replacement.
        </div>
      )}

      {/* Metadata — Category, Source MFE+version, Repository, Path, Last ingested */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <KV label="Category" value={c.functionalCategory} />
        <KV label="Source" value={`${c.sourceMfe} (${c.version})`} />
        <KV label="Repository" value={c.sourceRepo} />
        <KV label="Last ingested" value={new Date(c.lastIngested).toLocaleDateString()} />
      </div>
      <KV label="Path" value={c.sourcePath} mono />

      {/* Usage snippet */}
      <div className="rounded-md bg-gray-50 p-2 font-mono text-[10px] text-gray-700">
        <div className="text-gray-400">// Phase 2 — usage snippet from crawler</div>
        <div className="mt-1 break-all">import &#123; {c.name} &#125; from &apos;@openedx/{importPkg}&apos;;</div>
      </div>

      {/* Quick links — merged repo/file/issues/figma */}
      <div>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Quick links</div>
        <div className="flex flex-wrap gap-1.5">
          <ExternalChip href={fileUrl} label="Source file" />
          <ExternalChip href={`https://github.com/${c.sourceRepo}`} label="Repo" />
          <ExternalChip href={c.githubIssuesUrl} label="Issues" />
          {c.figmaCodeConnectUrl && <ExternalChip href={c.figmaCodeConnectUrl} label="Figma Code Connect" />}
          {c.figmaLibraryUrl && <ExternalChip href={c.figmaLibraryUrl} label="Figma Library" />}
        </div>
        {!hasFigma && (
          <p className="mt-1 text-[10px] text-gray-500">
            No Figma link yet — populated in Phase 2b (ADR-0002).
          </p>
        )}
      </div>

      {/* Consumers — at the bottom of Overview */}
      <ConsumersSection c={c} onSelect={onSelectConsumer} />
    </div>
  );
}

/**
 * Inset preview frame. For now this renders a placeholder card; Phase 2
 * (ADR-0001) will wire in Sandpack for actual component rendering. Components
 * we know how to render inline can be added to the renderInlinePreview
 * switch over time.
 */
function ComponentPreview({ c }: { c: GalleryComponent }) {
  const atomic = ATOMIC_LEVEL_META[c.atomicLevel];
  return (
    <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50">
      <div className="flex h-32 items-center justify-center">
        <PreviewPlaceholder c={c} atomicGradient={atomic.gradient} />
      </div>
    </div>
  );
}

function PreviewPlaceholder({
  c,
  atomicGradient,
}: {
  c: GalleryComponent;
  atomicGradient: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 text-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br ${atomicGradient} font-mono text-sm font-bold text-white shadow-sm`}
      >
        {c.name.charAt(0)}
      </div>
      <div className="font-mono text-xs font-medium text-gray-700">{c.name}</div>
      <div className="text-[10px] text-gray-400">Live preview lands in Phase 2 (ADR-0001)</div>
    </div>
  );
}

function ConsumersSection({
  c,
  onSelect,
}: {
  c: GalleryComponent;
  onSelect?: (mfe: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        Consumers {c.consumers.length > 0 && <span className="text-gray-400">· {c.consumers.length}</span>}
      </div>
      {c.consumers.length === 0 ? (
        <p className="text-[11px] text-gray-500">
          {c.sourceMfe === 'paragon'
            ? 'Dependency graph populated in Phase 2a.'
            : 'MFE-level component — consumed only by its own routes.'}
        </p>
      ) : (
        <ul className="space-y-1">
          {c.consumers.map((mfe) => (
            <li key={mfe}>
              <button
                type="button"
                onClick={() => onSelect?.(mfe)}
                className="flex w-full items-center justify-between rounded border border-gray-200 px-2 py-1 text-left font-mono text-[11px] text-gray-800 hover:border-gray-400 hover:bg-gray-50"
              >
                <span className="truncate">{mfe}</span>
                <span className="ml-1 text-gray-400">filter →</span>
              </button>
            </li>
          ))}
        </ul>
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
      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-0.5 break-all text-[12px] text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</div>
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
