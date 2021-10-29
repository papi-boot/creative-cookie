const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "public", "index.ts"),
  },
  performance: false,
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
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(js)$/i,
        exclude: /node_modules/,
        use: ["babel-loader"],
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new MiniCSSExtractPlugin({ filename: "[name].css" })],
};
