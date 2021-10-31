import { JSDOM } from "jsdom";
import DomPurify from "dompurify";
export class Clean {
  async cleanNow(string) {
    const htmlPurify = DomPurify(new JSDOM().window);
    const cleanInstance = htmlPurify.sanitize(string);
    return cleanInstance;
  }

  async cleanContent(string) {
    const htmlPurify = DomPurify(new JSDOM().window);
    const cleanInstance = htmlPurify.sanitize(string, {
      ALLOWED_TAGS: [
        "iframe",
        "img",
        "p",
        "strong",
        "em",
        "blockquote",
        "underline",
        "span",
        "del",
        "sup",
        "sub",
        "code",
        "pre",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ol",
        "ul",
        "li",
        "a",
        "video",
        "table",
        "tbody",
        "tr",
        "td",
        "br",
      ],
      ALLOWED_ATTR: [
        "src",
        "title",
        "frameborder",
        "allow",
        "allowfullscreen",
        "style",
        "alt",
        "href",
        "id",
        "target",
        "class",
        "width",
        "height",
        "loading",
      ],
    });
    return cleanInstance;
  }
}
