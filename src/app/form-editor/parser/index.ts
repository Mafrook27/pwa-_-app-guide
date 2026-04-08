// Parser module exports

export { parseHTML, type ParsedDocument } from './HTMLParser';
export { sanitizeHTML, escapeHTML, unescapeHTML } from './Sanitizer';
export { createRawHTMLBlock, mapParsedBlocksToEditor, type ParsedBlock, type TextMark, type TextSegment } from './BlockMapper';
export { 
  parseInlineMarks, 
  serializeMarksToHTML, 
  containsPlaceholders, 
  extractPlaceholders, 
  replacePlaceholder 
} from './MarkParser';
