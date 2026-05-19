/**
 * Open edX brand preset for Tailwind CSS.
 *
 * Token values are aligned with openedx.org's public brand:
 *   - Primary: #D74000 (orange-red) — CTAs, links, accents
 *   - Ink:     #00262B (deep teal-black) — dark surfaces, body chrome
 *   - Accent:  #5DE3BF (mint) — secondary highlights
 *   - Font:    Inter (loaded via next/font in app/layout.tsx)
 *
 * Long-term these will sync from style-dictionary output produced by Paragon.
 * See docs/adrs/0001-nextjs-app-router-fumadocs.md for the dogfooding policy
 * (Paragon tokens drive site chrome; Paragon components render only inside
 * <Preview> blocks).
 */

import type { Config } from 'tailwindcss';

const paragonPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Brand orange-red — sampled from openedx.org primary CTA color #D74000
        primary: {
          50: '#fff4ef',
          100: '#ffe1d2',
          200: '#ffbf9a',
          300: '#ff9c61',
          400: '#ff7029',
          500: '#d74000',
          600: '#b03600',
          700: '#8a2a00',
          800: '#631e00',
          900: '#3d1200',
        },
        // Ink — sampled from openedx.org dark surfaces #00262B
        ink: {
          50: '#e6ecec',
          100: '#bfcccd',
          200: '#8ea5a7',
          300: '#5d7e81',
          400: '#2c5a5e',
          500: '#00262b',
          600: '#001f23',
          700: '#00171a',
          800: '#001012',
          900: '#000809',
        },
        // Accent mint — secondary brand color #5DE3BF
        accent: {
          50: '#ecfbf6',
          100: '#c7f4e5',
          200: '#9eecd3',
          300: '#74e3c0',
          400: '#5de3bf',
          500: '#2cc59c',
          600: '#1f9b7a',
          700: '#157258',
          800: '#0c4836',
          900: '#031f17',
        },
        // Neutrals — sampled from openedx.org #525A5B body, #212529 headings, #CCCCCC borders
        gray: {
          50: '#fafafa',
          100: '#f4f5f5',
          200: '#e6e7e7',
          300: '#cccccc',
          400: '#a5a8a8',
          500: '#707070',
          600: '#525a5b',
          700: '#3d4344',
          800: '#212529',
          900: '#0f1112',
        },
        success: {
          DEFAULT: '#198754',
          light: '#d1e7dd',
          dark: '#0f5132',
        },
        danger: {
          DEFAULT: '#dc3545',
          light: '#f8d7da',
          dark: '#842029',
        },
        info: {
          DEFAULT: '#0dcaf0',
          light: '#cff4fc',
          dark: '#055160',
        },
        warning: {
          DEFAULT: '#ffc107',
          light: '#fff3cd',
          dark: '#664d03',
        },
      },
      fontFamily: {
        // Inter is loaded as a CSS variable via next/font in app/layout.tsx
        // and exposed as --font-inter. Tailwind references that variable.
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Fira Code"',
          '"Fira Mono"',
          '"Roboto Mono"',
          'ui-monospace',
          'monospace',
        ],
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },
      borderRadius: {
        // openedx.org uses a sharp/minimal radius — ~4px on buttons
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
};

export default paragonPreset;
