"use strict";

const path = require("path");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: "development",
  output: {
    filename: devMode ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    moduleIds: "hashed",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  node: {
    __filename: false,
    __dirname: false
  },
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".json"
    ]
  },
  devtool: "source-map"
};
