import sanitize from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "h5", "h6", "blockquote", "img", "ul", "ol", "li",
      "strong", "em", "a", "br", "div", "span", "figure", "figcaption",
      "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      // Only allow safe structural attributes — NO class or style on text elements
      // to prevent CMS-injected color classes from overriding our theme
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      // Only allow class on layout containers, not text-bearing elements
      div: ["class"],
      figure: ["class"],
      // All other elements: NO class, NO style — stripped clean
    },
    disallowedTagsMode: "discard",
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
      // Strip any inline styles from all elements
      "*": (tagName, attribs) => ({
        tagName,
        attribs: Object.fromEntries(
          Object.entries(attribs).filter(([key]) => key !== "style")
        ),
      }),
    },
  });
}
