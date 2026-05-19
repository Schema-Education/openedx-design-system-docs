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
    // TODO: link to the Code Connect integration doc once Phase 2b ships
    href: '/docs',
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Open edX Design System
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Atoms through pages across every Open edX MFE.
        </p>
        <p className="mt-3 text-lg text-gray-500">
          A unified registry linking Paragon components, Figma designs, and live
          code — one place to understand what exists and how to use it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/docs"
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Browse Docs
          </Link>
          <Link
            href="/docs/getting-started"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
              className="group rounded-xl border border-gray-200 p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <Link
          href="/docs"
          className="text-primary-600 hover:underline"
        >
          Read the product vision →
        </Link>
        <p className="mt-2">
          Built on{' '}
          <a
            href="https://fumadocs.dev"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Fumadocs
          </a>{' '}
          ·{' '}
          <a
            href="https://github.com/openedx/paragon"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Paragon
          </a>
        </p>
      </footer>
    </main>
  );
}
