import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';
import bundleAnalyzer from '@next/bundle-analyzer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX();
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  outputFileTracingRoot: path.join(__dirname, '..'),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 8,
  },
  experimental: {
    optimizePackageImports: [
      'fumadocs-ui',
      'fumadocs-core',
      'lucide-react',
      '@headlessui/react',
      'react-intl',
    ],
    webpackMemoryOptimizations: true,
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default withBundleAnalyzer(withMDX(config));
