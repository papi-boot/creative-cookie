import path from "path";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
let webpackCommon: {
  entry: object;
  performance: boolean;
  devtool: any;
  output: object;
  optimization: object;
  module: object;
  plugins: object;
  mode: any,
  devServer: object,
};
export default webpackCommon = {
  entry: {
    main: path.join(__dirname, "public", "index.js"),
  },
  performance: false,
  devtool: "",
  mode: "",
  devServer: {},
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "[name].bundle.js",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
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
          MiniCSSExtractPlugin.loader,
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
  plugins: [new MiniCSSExtractPlugin({ filename: "[name].css" })],
};
