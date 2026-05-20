/**
 * Streaming fallback shown while /registry compiles or hydrates.
 *
 * Why this exists: the gallery pulls in Paragon (Button/Badge) and Headless UI,
 * so dev-mode first-compile is ~5s and even a warm build's First Load JS is
 * ~150 kB. Without a `loading.tsx` neighbor, Next renders nothing during that
 * window and the "Browse the gallery" click feels broken.
 */
export default function RegistryLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8" aria-busy="true" aria-live="polite">
        {/* Header skeleton */}
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div className="space-y-2">
            <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Search + group-by skeleton */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="h-9 min-w-[260px] flex-1 animate-pulse rounded-md bg-gray-200" />
          <div className="h-9 w-44 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Atomic-level segmented + dropdown filters skeleton */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-36 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Result-count skeleton */}
        <div className="mb-4 h-4 w-48 animate-pulse rounded bg-gray-200" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white"
            />
          ))}
        </div>

        <span className="sr-only">Loading component gallery…</span>
      </div>
    </main>
  );
}
