import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { registrySource } from '@/lib/source';
import type { RegistryComponent } from '@/lib/registry';

// TODO: Future Sandpack live preview integration — see components/preview-frame.tsx
// When ADR-0001 is actioned, replace the frontmatter table below with
// <PreviewFrame> + <PropsTable> components wired to the manifest.

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  return registrySource.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = registrySource.getPage(params.slug);
  if (!page) notFound();

  const slugs = params.slug ?? [];
  const name = slugs[slugs.length - 1] ?? 'component';
  const atomicLevel = slugs[0] ?? '';

  return {
    title: `${(page.data as unknown as RegistryComponent).name ?? name} — Registry`,
    description: `Component registry entry for ${name} (${atomicLevel})`,
  };
}

function FrontmatterTable({ data }: { data: Record<string, unknown> }) {
  const rows = Object.entries(data).filter(
    ([key]) => key !== 'body' && key !== 'toc' && key !== 'title',
  );

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-2 pr-4 text-left font-semibold text-gray-700">
            Field
          </th>
          <th className="py-2 text-left font-semibold text-gray-700">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, value]) => (
          <tr key={key} className="border-b border-gray-100">
            <td className="py-2 pr-4 font-mono text-xs text-gray-500">
              {key}
            </td>
            <td className="py-2 text-gray-800">
              {Array.isArray(value)
                ? value.join(', ')
                : value === null || value === undefined
                  ? (
                      <span className="text-gray-400 italic">null</span>
                    )
                  : String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function RegistryPage(props: PageProps) {
  const params = await props.params;
  const page = registrySource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const slugs = params.slug ?? [];
  const atomicLevel = slugs[0] ?? '';
  const name = slugs[slugs.length - 1] ?? '';

  const frontmatter = page.data as unknown as RegistryComponent & {
    body: React.ComponentType;
    toc: unknown;
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
          {atomicLevel}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          {frontmatter.name ?? name}
        </h1>
        {frontmatter.sourceMfe && (
          <p className="mt-1 text-sm text-gray-500">
            Source MFE: <code>{frontmatter.sourceMfe}</code>
          </p>
        )}
      </div>

      {/* Manifest metadata table */}
      <section className="mb-10 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Manifest
        </h2>
        <FrontmatterTable
          data={page.data as unknown as Record<string, unknown>}
        />
      </section>

      {/* MDX body */}
      <section className="prose prose-gray max-w-none">
        <MDX />
      </section>

      {/* TODO: ADR-0001 — insert <PreviewFrame> Sandpack live preview here */}
      {/* TODO: insert <PropsTable> populated by react-docgen pipeline (Phase 2b) */}
    </main>
  );
}
