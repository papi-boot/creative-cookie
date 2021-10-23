"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
let webpackCommon;
exports.default = webpackCommon = {
    entry: {
        main: path_1.default.join(__dirname, "public", "index.js"),
    },
    performance: false,
    devtool: "",
    mode: "",
    devServer: {},
    output: {
        path: path_1.default.join(__dirname, "public/dist"),
        filename: "[name].bundle.js",
    },
    optimization: {
        minimize: true,
        minimizer: [new terser_webpack_plugin_1.default()],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(css|scss)$/i,
                exclude: /node_modules/,
                use: [
                    mini_css_extract_plugin_1.default.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpeg|jpg|ico|svg|gif)$/i,
                exclude: /node_modules/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [new mini_css_extract_plugin_1.default({ filename: "[name].css" })],
};
