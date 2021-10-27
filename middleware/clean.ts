import { JSDOM } from "jsdom";
import DomPurify from "dompurify";
export class Clean {
  public async cleanNow(s: string): Promise<string> {
    const htmlPurify = DomPurify(new JSDOM().window);
    const cleanInstance = htmlPurify.sanitize(s);
    return cleanInstance;
  }
}
