/**
 * Paragon Design Token Preset for Tailwind CSS
 *
 * These are PLACEHOLDER values aligned with Paragon's color philosophy.
 * TODO: Replace hardcoded values with style-dictionary output once the
 *       token pipeline (ADR-0002) is wired up. Each section is annotated
 *       with the Paragon token namespace it will eventually map to.
 */

import type { Config } from 'tailwindcss';

/** @see https://github.com/openedx/paragon — @openedx/paragon/src/tokens */
const paragonPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // TODO: sync from $brand-500 / --pgn-color-primary-* style-dictionary output
        primary: {
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // TODO: sync from $gray-* / --pgn-color-gray-* style-dictionary output
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // TODO: sync from $success / --pgn-color-success-* style-dictionary output
        success: {
          DEFAULT: '#198754',
          light: '#d1e7dd',
          dark: '#0f5132',
        },
        // TODO: sync from $danger / --pgn-color-danger-* style-dictionary output
        danger: {
          DEFAULT: '#dc3545',
          light: '#f8d7da',
          dark: '#842029',
        },
        // TODO: sync from $info / --pgn-color-info-* style-dictionary output
        info: {
          DEFAULT: '#0dcaf0',
          light: '#cff4fc',
          dark: '#055160',
        },
        // TODO: sync from $warning / --pgn-color-warning-* style-dictionary output
        warning: {
          DEFAULT: '#ffc107',
          light: '#fff3cd',
          dark: '#664d03',
        },
      },
      fontFamily: {
        // TODO: swap 'Inter' for Paragon's actual configured typeface once known.
        // Paragon does not mandate a single font; consult the consuming MFE's
        // _variables.scss for the override. Inter is a reasonable system default.
        sans: [
          'Inter',
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
        // TODO: sync from $spacer / --pgn-spacing-* style-dictionary output
        // Paragon uses Bootstrap's default $spacer = 1rem base; keeping that here.
        // Values: 0.25rem steps matching Bootstrap 5 / Paragon's utility scale
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
        // TODO: sync from $border-radius / --pgn-border-radius-* style-dictionary output
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
