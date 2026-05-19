import type { Config } from 'tailwindcss';
import paragonPreset from './paragon-tokens.preset';

const config: Config = {
  presets: [paragonPreset as Config],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
    // Include fumadocs-ui components so their classes aren't purged
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
