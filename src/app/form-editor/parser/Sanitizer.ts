// HTML Sanitizer - Removes scripts, unsafe handlers, and XSS vectors
// Must run before render and before export

/**
 * Sanitize HTML by removing dangerous content
 */
export function sanitizeHTML(html: string): string {
  // Create a temporary element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove style tags that could contain expressions
  const styles = doc.querySelectorAll('style');
  styles.forEach(style => {
    const content = style.textContent || '';
    // Remove style tags with expressions or behavior
    if (content.includes('expression') || content.includes('behavior') || content.includes('javascript:')) {
      style.remove();
    }
  });
  
  // Remove noscript tags
  const noscripts = doc.querySelectorAll('noscript');
  noscripts.forEach(ns => ns.remove());
  
  // Remove iframe, object, embed tags
  const embeds = doc.querySelectorAll('iframe, object, embed, applet');
  embeds.forEach(embed => embed.remove());
  
  // Process all elements
  const allElements = doc.body.querySelectorAll('*');
  allElements.forEach(element => {
    sanitizeElement(element as HTMLElement);
  });
  
  return doc.body.innerHTML;
}

/**
 * Sanitize a single element
 */
function sanitizeElement(element: HTMLElement): void {
  // List of dangerous event handlers
  const dangerousAttributes = [
    'onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate',
    'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus',
    'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur',
    'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu',
    'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged',
    'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend',
    'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop',
    'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus',
    'onfocusin', 'onfocusout', 'onhashchange', 'onhelp', 'oninput', 'onkeydown',
    'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture',
    'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove',
    'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove',
    'onmoveend', 'onmovestart', 'onoffline', 'ononline', 'onpage', 'onpaste',
    'onpause', 'onplay', 'onplaying', 'onpopstate', 'onprogress',
    'onpropertychange', 'onreadystatechange', 'onreset', 'onresize',
    'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete',
    'onrowsinserted', 'onscroll', 'onsearch', 'onselect', 'onselectionchange',
    'onselectstart', 'onstart', 'onstop', 'onstorage', 'onsubmit', 'ontimeupdate',
    'ontoggle', 'onunload', 'onvolumechange', 'onwaiting'
  ];
  
  // Remove dangerous attributes
  for (const attr of dangerousAttributes) {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  }
  
  // Sanitize href attributes (remove javascript:)
  if (element.hasAttribute('href')) {
    const href = element.getAttribute('href') || '';
    if (href.toLowerCase().trim().startsWith('javascript:')) {
      element.setAttribute('href', '#');
    }
  }
  
  // Sanitize src attributes (remove javascript:)
  if (element.hasAttribute('src')) {
    const src = element.getAttribute('src') || '';
    if (src.toLowerCase().trim().startsWith('javascript:')) {
      element.removeAttribute('src');
    }
  }
  
  // Sanitize data- attributes with javascript:
  for (let i = element.attributes.length - 1; i >= 0; i--) {
    const attr = element.attributes[i];
    if (attr.name.startsWith('data-') && attr.value.toLowerCase().includes('javascript:')) {
      element.removeAttribute(attr.name);
    }
  }
  
  // Sanitize style attribute
  if (element.hasAttribute('style')) {
    const style = element.getAttribute('style') || '';
    const sanitizedStyle = sanitizeStyleAttribute(style);
    if (sanitizedStyle) {
      element.setAttribute('style', sanitizedStyle);
    } else {
      element.removeAttribute('style');
    }
  }
  
  // Sanitize SVG xlink:href
  if (element.hasAttribute('xlink:href')) {
    const href = element.getAttribute('xlink:href') || '';
    if (href.toLowerCase().trim().startsWith('javascript:')) {
      element.removeAttribute('xlink:href');
    }
  }
}

/**
 * Sanitize style attribute value
 */
function sanitizeStyleAttribute(style: string): string {
  // Remove dangerous CSS patterns
  const dangerousPatterns = [
    /expression\s*\(/gi,
    /javascript\s*:/gi,
    /behavior\s*:/gi,
    /-moz-binding\s*:/gi,
    /url\s*\(\s*["']?\s*javascript:/gi,
    /url\s*\(\s*["']?\s*data:/gi,
  ];
  
  let sanitized = style;
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  return sanitized.trim();
}

/**
 * Sanitize user input for display
 */
export function escapeHTML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Unescape HTML entities
 */
export function unescapeHTML(str: string): string {
  if (!str) return '';
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.body.textContent || '';
}
