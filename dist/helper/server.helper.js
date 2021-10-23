"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerHelper = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
class ServerHelper {
    constructor() {
        this.app = express_1.default();
        this.SECRET_KEY = process.env.SECRET_KEY;
    }
    startMiddleWare() {
        this.app.use(cors_1.default({
            credentials: true,
            origin: "*",
        }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        this.app.use(express_1.default.json());
        this.app.set("view engine", "ejs");
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_session_1.default({
            secret: this.SECRET_KEY,
            saveUninitialized: false,
            resave: true,
        }));
    }
}
exports.ServerHelper = ServerHelper;
