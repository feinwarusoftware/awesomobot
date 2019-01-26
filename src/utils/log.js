"use strict";

const info = str => {

  // if (process.env.JS_LOG != null && (process.env.JS_LOG.toLowerCase()
  // === "info" || process.env.JS_LOG.toLowerCase() === "all")) {

  console.log("\x1b[32m\x1b[2m%s\x1b[0m", str);
  // }
};

const warn = str => {

  // if (process.env.JS_LOG != null && (process.env.JS_LOG.toLowerCase()
  // === "warn" || process.env.JS_LOG.toLowerCase() === "all")) {

  console.log("\x1b[33m\x1b[2m%s\x1b[0m", str);
  // }
};

const error = str => {

  // if (process.env.JS_LOG != null && (process.env.JS_LOG.toLowerCase()
  // === "error" || process.env.JS_LOG.toLowerCase() === "all")) {

  console.error("\x1b[31m\x1b[2m%s\x1b[0m", str);
  // }
};

module.exports = {

  info,
  warn,
  error
};
