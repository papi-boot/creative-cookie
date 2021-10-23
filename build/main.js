"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, ".env") }).parsed;
const server_helper_1 = require("./helper/server.helper");
const routes_1 = require("./routes/routes");
class Main extends server_helper_1.ServerHelper {
    constructor() {
        super(...arguments);
        this.PORT = process.env.PORT || 3030;
    }
    startRoute(routes) {
        this.app.use(routes);
    }
    startListen() {
        try {
            this.app.listen(this.PORT, () => {
                console.log(`SERVER START AT http://locahost:${this.PORT}`);
            });
        }
        catch (err) {
            console.error();
        }
    }
}
exports.Main = Main;
const main = new Main();
const routes = new routes_1.Routes();
main.startMiddleWare();
main.startRoute(routes.GET_REQUEST());
main.startListen();
