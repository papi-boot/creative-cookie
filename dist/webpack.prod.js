"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_merge_1 = require("webpack-merge");
const webpack_common_1 = __importDefault(require("./webpack.common"));
exports.default = webpack_merge_1.merge(webpack_common_1.default, Object.assign(Object.assign({}, webpack_common_1.default), { mode: "production", devtool: "inline-source-map" }));
