import sanitizeHtml from "sanitize-html";

const BLOG_CONTENT_LIMIT = 200_000;

const allowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "mark",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeBlogContent(content: string) {
  if (typeof content !== "string") {
    throw new Error("Article content must be text.");
  }
  if (content.length > BLOG_CONTENT_LIMIT) {
    throw new Error("Article content must be 200,000 characters or fewer.");
  }

  if (!/<\/?[a-z][^>]*>/i.test(content)) {
    return content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map(
        (paragraph) =>
          `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`
      )
      .join("");
  }

  return sanitizeHtml(content, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}
