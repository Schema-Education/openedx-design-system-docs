import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

/**
 * Fumadocs MDX source collections.
 *
 * - `docs`     — hand-authored documentation pages under content/docs/
 * - `registry` — auto-generated component registration pages under content/registry/
 *                (populated by the future crawler agent — see ADR-0003)
 */
export const { docs, meta: docsMeta } = defineDocs({
  dir: 'content/docs',
});

export const { docs: registry, meta: registryMeta } = defineDocs({
  dir: 'content/registry',
});

export default defineConfig({
  mdxOptions: {
    // TODO: add remark-gfm, rehype-pretty-code, or other plugins here
    // as the content pipeline matures (Phase 2a).
  },
});
