import type { ReactNode } from 'react';

interface KbdProps {
  children: ReactNode;
  className?: string;
}

/**
 * Small keyboard-shortcut chip. Use one <Kbd> per logical key:
 * `<Kbd>⌘</Kbd><Kbd>K</Kbd>`.
 */
export function Kbd({ children, className = '' }: KbdProps) {
  return (
    <kbd
      className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-gray-300 bg-gray-50 px-1 font-sans text-[10px] font-semibold text-gray-600 shadow-[inset_0_-1px_0_0_rgb(229_231_235)] ${className}`}
    >
      {children}
    </kbd>
  );
}
