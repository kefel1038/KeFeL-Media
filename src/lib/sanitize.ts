import sanitize from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "h5", "h6", "blockquote", "img", "ul", "ol", "li",
      "strong", "em", "a", "br", "div", "span", "figure", "figcaption",
      "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "class", "width", "height"],
      div: ["class"],
      span: ["class"],
      figure: ["class"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}
