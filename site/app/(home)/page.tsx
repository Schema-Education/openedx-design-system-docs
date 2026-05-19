import Link from 'next/link';

const features = [
  {
    title: 'Atomic Taxonomy',
    description:
      'Components classified from atoms to pages using a strict atomic design hierarchy. Every component knows its level, source MFE, and composites.',
    icon: '⚛',
    href: '/docs/atomic-design',
  },
  {
    title: 'Multi-MFE Coverage',
    description:
      'Registry spans frontend-app-learning, frontend-app-authoring, frontend-app-course-authoring, and 10+ other Open edX MFEs — one source of truth.',
    icon: '🗂',
    href: '/docs/getting-started',
  },
  {
    title: 'Figma Code Connect',
    description:
      'Each registered component links Figma node IDs to live code via Code Connect, closing the designer–developer gap without manual sync.',
    icon: '🔗',
    href: '/docs',
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-500">
          Open edX · Design System
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-gray-800 sm:text-6xl">
          One design system,<br />
          <span className="text-primary-500">every MFE.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Atoms through pages across every Open edX micro-frontend.
        </p>
        <p className="mt-3 text-lg text-gray-500">
          A unified registry linking Paragon components, Figma designs, and live
          code — one place to understand what exists and how to use it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/docs"
            className="rounded bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Browse Docs
          </Link>
          <Link
            href="/docs/getting-started"
            className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-500 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded border border-gray-200 bg-white p-6 transition hover:border-primary-500 hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-primary-500">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ink band — echoes openedx.org's dark CTA strip */}
      <section className="bg-ink-500 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            An agentic v1 vision — open to contribution.
          </h2>
          <p className="mt-4 text-lg text-ink-100">
            Schema Education, Axim Collaborative, and the Open edX provider
            community are invited to revise the reframings and architecture
            that shape this system.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/Schema-Education/openedx-design-system-docs/blob/main/vision/product-vision.mdx"
              target="_blank"
              rel="noreferrer"
              className="rounded bg-accent-400 px-6 py-3 text-sm font-semibold text-ink-800 transition hover:bg-accent-300"
            >
              Read the product vision →
            </a>
            <a
              href="https://github.com/Schema-Education/openedx-design-system-docs/blob/main/proposals/0001-mfe-component-registry.md"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
            >
              ODS-RFC-0001
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>
          Built on{' '}
          <a
            href="https://fumadocs.dev"
            className="text-primary-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Fumadocs
          </a>{' '}
          ·{' '}
          <a
            href="https://github.com/openedx/paragon"
            className="text-primary-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Paragon
          </a>{' '}
          ·{' '}
          <a
            href="https://openedx.org"
            className="text-primary-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            openedx.org
          </a>
        </p>
      </footer>
    </main>
  );
}
