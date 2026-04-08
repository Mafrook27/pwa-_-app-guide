// Block Mapper - Maps parsed blocks to editor structure
// For external HTML: Creates RawHTML blocks to preserve original styling
// For editor-generated HTML: Restores exact block types

import { v4 as uuidv4 } from 'uuid';
import type { EditorBlock, EditorSection } from '../editorConfig';

// Re-export from HTMLParser for compatibility
export type ParsedBlock = EditorBlock;

// This is now handled directly in HTMLParser.ts
// The mapper is kept for any legacy code that might reference it

/**
 * Create a raw HTML block that preserves original content
 */
export function createRawHTMLBlock(html: string, styles: string = ''): EditorBlock {
  return {
    id: uuidv4(),
    type: 'raw-html' as const,
    htmlContent: html,
    originalStyles: styles,
    width: 100,
    marginTop: 0,
    marginBottom: 8,
    paddingX: 0,
    paddingY: 0,
    locked: false,
  };
}

/**
 * Map parsed blocks to editor blocks (legacy compatibility)
 */
export function mapParsedBlocksToEditor(blocks: EditorBlock[]): EditorBlock[] {
  return blocks;
}

// Text marks for inline formatting
export interface TextMark {
  type: 'bold' | 'italic' | 'underline' | 'link' | 'textColor' | 'fontSize' | 'highlight' | 'placeholder';
  value?: string;
}

export interface TextSegment {
  text: string;
  marks: TextMark[];
}
