"use strict";

const merge = require("webpack-merge");

const baseConfig = require("./webpack.common");

module.exports = merge.smart(baseConfig, {
  mode: "production"
});
