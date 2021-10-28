const { merge } = require("webpack-merge");
const common = require("./webpack.common");
export default merge(common, {
  mode: "production",
  devtool: "inline-source-map",
});
