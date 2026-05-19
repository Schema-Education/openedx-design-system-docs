import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { docs, docsMeta, registry, registryMeta } from '@/.source';

/**
 * Primary docs source — hand-authored pages under content/docs/
 */
export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, docsMeta),
});

/**
 * Registry source — auto-generated component pages under content/registry/
 * TODO: Phase 2a — the crawler agent will populate content/registry/ and
 *       this source will grow automatically.
 */
export const registrySource = loader({
  baseUrl: '/registry',
  source: createMDXSource(registry, registryMeta),
});
