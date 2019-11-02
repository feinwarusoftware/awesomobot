"use strict";

const path = require("path");

const webpack = require("webpack");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.common");

const devMode = process.env.NODE_ENV !== "production";

module.exports = merge.smart(baseConfig, {
  output: {
    filename: devMode ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
    //hotUpdateChunkFilename: ".hot/[id].[hash].hot-update.js",
    //hotUpdateMainFilename: ".hot/[hash].hot-update.json"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
