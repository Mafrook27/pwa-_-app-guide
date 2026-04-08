import React, { memo } from 'react';
import type { DividerBlockProps } from '../editorConfig';

export const DividerBlock = memo(function DividerBlock({ block }: { block: DividerBlockProps }) {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${block.thickness}px ${block.style} ${block.color || 'hsl(var(--border))'}`,
        width: '100%',
      }}
    />
  );
});
