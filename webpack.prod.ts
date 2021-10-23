import { merge } from "webpack-merge";
import webpackCommon from "./webpack.common";
export default merge(webpackCommon, {
  ...webpackCommon,
  mode: "production",
  devtool: "inline-source-map",
});
