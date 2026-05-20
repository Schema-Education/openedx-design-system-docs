import type { Config } from 'tailwindcss';
import paragonPreset from './paragon-tokens.preset';

const config: Config = {
  presets: [paragonPreset as Config],
  // Fumadocs toggles dark mode by adding a `dark` class to <html>; opt into
  // class-based dark mode so our `dark:` utilities respond to the toggle.
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
    // Include fumadocs-ui components so their classes aren't purged
    './node_modules/fumadocs-ui/dist/**/*.js',
    // Prototype devbar ships compiled JS with Tailwind utility class names;
    // its peer is Tailwind v4 but the utilities themselves work in v3.
    './node_modules/@sdaitzman/prototype-devbar/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  // Atomic-level colors are referenced via the ATOMIC_LEVEL_META map in lib/gallery.ts,
  // so Tailwind's static scanner can't see them. Safelist the full palette.
  safelist: [
    {
      pattern:
        /(bg|text|ring|from|to)-(sky|emerald|violet|amber|rose)-(100|200|300|400|600|700|800)/,
    },
  ],
  plugins: [],
};

export default config;
