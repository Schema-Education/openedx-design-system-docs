'use client';

import React from 'react';

/**
 * Render-phase error boundary for Paragon preview tiles.
 *
 * Paragon v23.x relies on legacy `defaultProps` for several function /
 * forwardRef components (DataTable internals, Form.Checkbox, Form.Autosuggest,
 * react-bootstrap Fade, etc.). React 19 dropped that support, so a handful of
 * components throw at render-time rather than during the preview's render
 * function call. The inline `try/catch` in component-card / component-usage
 * cannot intercept those errors, so without a boundary one broken preview
 * takes the whole gallery down with an "Application error" page.
 *
 * This boundary renders the supplied `fallback` whenever its child subtree
 * throws, isolating each preview from its siblings.
 */
interface PreviewErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

export class PreviewErrorBoundary extends React.Component<
  PreviewErrorBoundaryProps,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[preview] ${this.props.componentName ?? 'unknown'} threw during render:`,
        error,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
