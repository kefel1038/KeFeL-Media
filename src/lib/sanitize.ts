let _sanitize: ((html: string) => string) | null = null;

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: use isomorphic-dompurify
    if (!_sanitize) {
      const DOMPurify = require("isomorphic-dompurify");
      _sanitize = (h: string) =>
        DOMPurify.sanitize(h, {
          ALLOWED_TAGS: [
            "p", "h2", "h3", "h4", "blockquote", "img", "ul", "ol", "li",
            "strong", "em", "a", "br", "div", "span", "figure", "figcaption",
          ],
          ALLOWED_ATTR: [
            "href", "target", "rel", "src", "alt", "class", "width", "height",
          ],
        });
    }
    return _sanitize(html);
  }

  // Client-side: use DOMPurify from isomorphic-dompurify
  if (!_sanitize) {
    const DOMPurify = require("isomorphic-dompurify");
    _sanitize = (h: string) =>
      DOMPurify.sanitize(h, {
        ALLOWED_TAGS: [
          "p", "h2", "h3", "h4", "blockquote", "img", "ul", "ol", "li",
          "strong", "em", "a", "br", "div", "span", "figure", "figcaption",
        ],
        ALLOWED_ATTR: [
          "href", "target", "rel", "src", "alt", "class", "width", "height",
        ],
      });
  }
  return _sanitize(html);
}
