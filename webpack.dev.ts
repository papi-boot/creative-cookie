import { merge } from "webpack-merge";
import webpackCommon from "./webpack.common";
import path from "path";
export default merge(webpackCommon, {
  ...webpackCommon,
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: 3030,
    contentBase: path.join(__dirname, "public", "dist"),
    watchContentBase: true,
  },
});
