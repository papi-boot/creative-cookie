import { JSDOM } from "jsdom";
import DomPurify from "dompurify";
export class Clean {
  async cleanNow(string) {
    const htmlPurify = DomPurify(new JSDOM().window);
    const cleanInstance = htmlPurify.sanitize(string);
    return cleanInstance;
  }
}
