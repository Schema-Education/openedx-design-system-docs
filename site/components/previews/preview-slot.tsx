'use client';

import type { CSSProperties, ReactNode } from 'react';

type Align = 'start' | 'center' | 'stretch';

interface PreviewSlotProps {
  children: ReactNode;
  width?: number;
  height?: number;
  align?: Align;
}

const alignClass: Record<Align, string> = {
  start: 'items-start justify-start',
  center: 'items-center justify-center',
  stretch: 'items-stretch justify-stretch',
};

export function PreviewSlot({
  children,
  width,
  height,
  align = 'center',
}: PreviewSlotProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div className={`flex w-full ${alignClass[align]}`}>
      <div style={style}>{children}</div>
    </div>
  );
}

export default PreviewSlot;
