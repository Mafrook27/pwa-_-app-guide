// Raw HTML Block - Preserves original HTML without conversion
// Used for complex structures like tables, nested layouts, etc.

import React, { memo, useRef, useState, useEffect } from 'react';
import { useEditor } from '../EditorContext';
import type { RawHTMLBlockProps } from '../editorConfig';

export const RawHTMLBlock = memo(function RawHTMLBlock({ block }: { block: RawHTMLBlockProps }) {
  const { state, updateBlockWithHistory } = useEditor();
  const isPreview = state.isPreviewMode;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Apply professional agreement styling
  useEffect(() => {
    if (containerRef.current) {
      // Find signature buttons and attach click handlers
      const signButtons = containerRef.current.querySelectorAll('[data-signature-button], .signature-button, button:contains("SIGN")');
      signButtons.forEach(btn => {
        (btn as HTMLElement).style.cursor = 'pointer';
        btn.addEventListener('click', handleSignatureClick);
      });
      
      return () => {
        signButtons.forEach(btn => {
          btn.removeEventListener('click', handleSignatureClick);
        });
      };
    }
  }, [block.htmlContent]);
  
  const handleSignatureClick = () => {
    // Show signature status message
    alert('Signature update in progress...');
    // Future: API call for signature
  };
  
  // Render preserved HTML with scoped styling
  return (
    <div 
      ref={containerRef}
      className="raw-html-block"
      style={{
        // Preserve original typography - don't override
        fontSize: 'inherit',
        lineHeight: 'inherit',
      }}
    >
      <style>{`
        .raw-html-block {
          /* Professional agreement document styling */
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          background: #fff;
        }
        .raw-html-block table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }
        .raw-html-block td, .raw-html-block th {
          padding: 8px;
          border: 1px solid #000;
          vertical-align: top;
          font-size: inherit;
        }
        .raw-html-block p {
          margin: 0 0 8px 0;
          text-align: justify;
          font-size: inherit;
        }
        .raw-html-block h1, .raw-html-block h2, .raw-html-block h3 {
          text-align: center;
          font-weight: bold;
          margin: 12px 0;
        }
        .raw-html-block .signature-area,
        .raw-html-block [data-signature] {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .raw-html-block .sign-button,
        .raw-html-block [data-signature-button] {
          background: #ffeb3b;
          border: 1px solid #000;
          padding: 4px 12px;
          cursor: pointer;
          font-weight: bold;
        }
        .raw-html-block a {
          color: #0066cc;
          text-decoration: underline;
        }
        /* Placeholder highlighting */
        .raw-html-block .placeholder,
        .raw-html-block [class*="PH@"],
        .raw-html-block span[style*="background"] {
          background-color: #b3d4fc;
          padding: 0 2px;
        }
      `}</style>
      
      {/* Render original HTML directly */}
      <div 
        dangerouslySetInnerHTML={{ __html: block.htmlContent }}
        contentEditable={isEditing && !isPreview}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (isEditing) {
            setIsEditing(false);
            const newHtml = e.currentTarget.innerHTML;
            if (newHtml !== block.htmlContent) {
              updateBlockWithHistory(block.id, { htmlContent: newHtml });
            }
          }
        }}
        onDoubleClick={() => !block.locked && !isPreview && setIsEditing(true)}
        style={{
          outline: isEditing ? '2px solid #3b82f6' : 'none',
          minHeight: '20px',
        }}
      />
    </div>
  );
});
