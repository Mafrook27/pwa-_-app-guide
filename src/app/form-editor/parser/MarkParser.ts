// Mark Parser - Handles inline formatting marks (bold, italic, underline, etc.)
// Parses inline HTML and extracts text segments with their formatting marks

export interface TextMark {
  type: 'bold' | 'italic' | 'underline' | 'link' | 'textColor' | 'fontSize' | 'highlight' | 'placeholder';
  value?: string; // href for links, color value, font size, placeholder value
}

export interface TextSegment {
  text: string;
  marks: TextMark[];
}

/**
 * Parse HTML content and extract text segments with marks
 */
export function parseInlineMarks(htmlContent: string): TextSegment[] {
  if (!htmlContent) return [{ text: '', marks: [] }];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
  const container = doc.body.firstElementChild;
  
  if (!container) return [{ text: htmlContent, marks: [] }];
  
  const segments: TextSegment[] = [];
  processNode(container, [], segments);
  
  return segments.length > 0 ? segments : [{ text: '', marks: [] }];
}

/**
 * Recursively process DOM nodes and extract text with marks
 */
function processNode(node: Node, inheritedMarks: TextMark[], segments: TextSegment[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text) {
      // Check for @ placeholders in text
      const placeholderRegex = /@[\w]+/g;
      let lastIndex = 0;
      let match;
      
      while ((match = placeholderRegex.exec(text)) !== null) {
        // Text before placeholder
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          if (beforeText) {
            segments.push({ text: beforeText, marks: [...inheritedMarks] });
          }
        }
        
        // Placeholder itself
        segments.push({
          text: match[0],
          marks: [...inheritedMarks, { type: 'placeholder', value: match[0] }]
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Remaining text after last placeholder
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex);
        if (remainingText) {
          segments.push({ text: remainingText, marks: [...inheritedMarks] });
        }
      }
      
      // No placeholders found - add entire text
      if (lastIndex === 0 && text) {
        segments.push({ text, marks: [...inheritedMarks] });
      }
    }
    return;
  }
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    const currentMarks = [...inheritedMarks];
    
    // Add marks based on element type
    switch (tagName) {
      case 'strong':
      case 'b':
        currentMarks.push({ type: 'bold' });
        break;
      case 'em':
      case 'i':
        currentMarks.push({ type: 'italic' });
        break;
      case 'u':
        currentMarks.push({ type: 'underline' });
        break;
      case 'a':
        currentMarks.push({ type: 'link', value: element.getAttribute('href') || '' });
        break;
      case 'span':
        // Check for inline styles
        const style = element.style;
        if (style.color) {
          currentMarks.push({ type: 'textColor', value: style.color });
        }
        if (style.fontSize) {
          currentMarks.push({ type: 'fontSize', value: style.fontSize });
        }
        if (style.backgroundColor) {
          currentMarks.push({ type: 'highlight', value: style.backgroundColor });
        }
        break;
    }
    
    // Check for style attribute on any element
    if (element.style.color && !currentMarks.some(m => m.type === 'textColor')) {
      currentMarks.push({ type: 'textColor', value: element.style.color });
    }
    if (element.style.fontSize && !currentMarks.some(m => m.type === 'fontSize')) {
      currentMarks.push({ type: 'fontSize', value: element.style.fontSize });
    }
    if (element.style.backgroundColor && !currentMarks.some(m => m.type === 'highlight')) {
      currentMarks.push({ type: 'highlight', value: element.style.backgroundColor });
    }
    
    // Process children
    for (let i = 0; i < node.childNodes.length; i++) {
      processNode(node.childNodes[i], currentMarks, segments);
    }
  }
}

/**
 * Convert text segments back to HTML
 */
export function serializeMarksToHTML(segments: TextSegment[]): string {
  let html = '';
  
  for (const segment of segments) {
    let text = escapeHTML(segment.text);
    
    // Apply marks in reverse order (innermost first)
    for (const mark of segment.marks) {
      switch (mark.type) {
        case 'bold':
          text = `<strong>${text}</strong>`;
          break;
        case 'italic':
          text = `<em>${text}</em>`;
          break;
        case 'underline':
          text = `<u>${text}</u>`;
          break;
        case 'link':
          text = `<a href="${escapeAttribute(mark.value || '#')}">${text}</a>`;
          break;
        case 'textColor':
          text = `<span style="color: ${escapeAttribute(mark.value || '')}">${text}</span>`;
          break;
        case 'fontSize':
          text = `<span style="font-size: ${escapeAttribute(mark.value || '')}">${text}</span>`;
          break;
        case 'highlight':
          text = `<span style="background-color: ${escapeAttribute(mark.value || '')}">${text}</span>`;
          break;
        case 'placeholder':
          // Keep placeholders as-is, they're special tokens
          text = `<span class="placeholder" data-placeholder="${escapeAttribute(mark.value || '')}">${text}</span>`;
          break;
      }
    }
    
    html += text;
  }
  
  return html;
}

/**
 * Check if text contains placeholders
 */
export function containsPlaceholders(text: string): boolean {
  return /@[\w]+/.test(text);
}

/**
 * Extract all placeholders from text
 */
export function extractPlaceholders(text: string): string[] {
  const matches = text.match(/@[\w]+/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Replace placeholder with value
 */
export function replacePlaceholder(text: string, placeholder: string, value: string): string {
  return text.replace(new RegExp(escapeRegex(placeholder), 'g'), value);
}

// Helper functions

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
