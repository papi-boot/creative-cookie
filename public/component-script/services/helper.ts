
export class Helper {
  public querySel(className: string): any {
    const result = document.querySelector(className);
    return result;
  }
  public querySelAll(className: string): any {
    const result = document.querySelectorAll(className);
    return result;
  }
}
