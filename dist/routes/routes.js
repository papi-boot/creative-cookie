"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
const login_controller_1 = require("../controller/login/login.controller");
class Routes {
    constructor() {
        this.routes = express_1.default.Router();
    }
    GET_REQUEST() {
        // @TODO: ALL HTTP GET ROUTE
        this.routes.get(new login_controller_1.LoginController().ROUTE_PATH, new login_controller_1.LoginController().userLogin);
        return this.routes;
    }
    POST_REQUEST() {
        // @TODO: ALL HTTP POST ROUTE
        return this.routes;
    }
    PUT_REQUEST() {
        // @TODO: ALL HTTP POST ROUTE
        return this.routes;
    }
    DELETE_REQUEST() {
        // @TODO: ALL HTTP POST ROUTE
        return this.routes;
    }
    NOT_FOUND() {
    }
}
exports.Routes = Routes;
