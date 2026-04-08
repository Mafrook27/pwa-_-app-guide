import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useEditor } from '../EditorContext';
import { PlaceholderDropdown, usePlaceholderTrigger, insertPlaceholderIntoText } from '../plugins/PlaceholderPlugin';
import { containsPlaceholders } from '../parser/MarkParser';
import type { HeadingBlockProps } from '../editorConfig';

export const HeadingBlock = memo(function HeadingBlock({ block }: { block: HeadingBlockProps }) {
  const { state, updateBlockWithHistory } = useEditor();
  const isPreview = state.isPreviewMode;
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  
  const handlePlaceholderInsert = useCallback((placeholder: string, position: number) => {
    const newContent = insertPlaceholderIntoText(block.content, placeholder, position);
    updateBlockWithHistory(block.id, { content: newContent });
  }, [block.content, block.id, updateBlockWithHistory]);
  
  const placeholderTrigger = usePlaceholderTrigger({
    onInsert: handlePlaceholderInsert,
  });

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const headingStyle: React.CSSProperties = {
    fontSize: `${block.fontSize}px`,
    fontWeight: block.fontWeight,
    textAlign: block.textAlign as React.CSSProperties['textAlign'],
    lineHeight: block.lineHeight,
    color: block.color || 'inherit',
    fontFamily: "'Space Grotesk', sans-serif",
    outline: 'none',
    cursor: isPreview ? 'default' : 'text',
  };
  
  // Render content with placeholder highlighting
  const renderContent = () => {
    const content = block.content;
    if (!content) return isPreview ? '' : <span className="text-muted-foreground/50">Click to add heading...</span>;
    
    // Check for placeholders and highlight them
    if (containsPlaceholders(content)) {
      const parts = content.split(/(@\w+)/g);
      return parts.map((part, idx) => {
        if (part.match(/^@\w+$/)) {
          return (
            <span 
              key={idx} 
              className="bg-primary/10 text-primary px-1 rounded"
            >
              {part}
            </span>
          );
        }
        return part;
      });
    }
    
    return content;
  };

  if (isPreview) {
    return <div style={headingStyle}>{renderContent()}</div>;
  }

  return (
    <>
      <div
        ref={editRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        style={headingStyle}
        className="min-h-[1em]"
        onDoubleClick={() => !block.locked && setIsEditing(true)}
        onBlur={(e) => {
          setIsEditing(false);
          placeholderTrigger.close();
          const newContent = e.currentTarget.textContent || '';
          if (newContent !== block.content) {
            updateBlockWithHistory(block.id, { content: newContent });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
          if (editRef.current) {
            placeholderTrigger.handleKeyDown(e as any, editRef.current);
          }
        }}
      >
        {renderContent()}
      </div>
      
      <PlaceholderDropdown
        isOpen={placeholderTrigger.isOpen}
        onClose={placeholderTrigger.close}
        onSelect={placeholderTrigger.handleSelect}
        position={placeholderTrigger.position}
        searchTerm={placeholderTrigger.searchTerm}
      />
    </>
  );
});
