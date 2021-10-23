import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, ".env") }).parsed;
import { ServerHelper } from "./helper/server.helper";
import { Routes } from "./routes/routes";

export class Main extends ServerHelper {
  private PORT = process.env.PORT || 3030;
  public startRoute(routes: any): void {
    this.app.use(routes);
  }
  public startListen(): void {
    try {
      this.app.listen(this.PORT, () => {
        console.log(`SERVER START AT http://locahost:${this.PORT}`);
      })
    } catch (err) {
      console.error()
    }
  }
}
const main = new Main();
const routes = new Routes();
main.startMiddleWare();
main.startRoute(routes.GET_REQUEST());
main.startListen();

