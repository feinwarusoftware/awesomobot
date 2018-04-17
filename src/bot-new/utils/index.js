"use strict";

const path = require("path");

const logger = require("./logger");
const jsonconfig = require("./jsonconfig");
const request = require("./request");

const globLogger = new logger.Logger(logger.LOG_DEBUG | logger.LOG_ERROR | logger.LOG_WARNING | logger.LOG_INFO);

const globConfig = new jsonconfig.Config(path.join(__dirname, "../config/bot.json"));

function opt(options, name, def) {
    return options && options[name]!==undefined ? options[name] : def;
}

function allIndicesOf(string, search) {
    let indices = [];
    for(let pos = string.indexOf(search); pos !== -1; pos = string.indexOf(search, pos + 1)) {
        indices.push(pos);
    }
    return indices;
}

module.exports = {
    logger,
    jsonconfig,
    request,
    opt,
    allIndicesOf,

    globLogger,
    globConfig
}
