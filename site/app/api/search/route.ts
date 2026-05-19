/**
 * Search API route — stub.
 *
 * Pagefind generates a fully static client-side index at `/out/pagefind/`
 * during the build step (`pagefind --site out`). The pagefind JS bundle loads
 * that index in the browser without needing a server-side search endpoint.
 *
 * This route exists as a placeholder for completeness and for any future
 * server-side search augmentation (e.g., highlighting, analytics).
 *
 * TODO: If a server-side search endpoint is needed (e.g., for Fumadocs
 *       search integration that expects /api/search), wire up fumadocs-core's
 *       createSearchAPI here using the `registry` and `docs` sources.
 *       See: https://fumadocs.dev/docs/headless/search
 */

export const dynamic = 'force-static';

export function GET() {
  return new Response(
    JSON.stringify({
      message:
        'Search is handled client-side by the Pagefind bundle at /pagefind/. This endpoint is a placeholder.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
