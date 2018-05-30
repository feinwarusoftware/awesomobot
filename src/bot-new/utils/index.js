"use strict";

const path = require("path");

const logger = require("./logger");
const jsonconfig = require("./jsonconfig");
const request = require("./request");

const globLogger = new logger.Logger(logger.LOG_DEBUG | logger.LOG_ERROR | logger.LOG_WARNING | logger.LOG_INFO);

const globConfig = new jsonconfig.Config(path.join(__dirname, "../config/bot.json"));

function opt(options, name, def) {
    return options && options[name] !== undefined ? options[name] : def;
}

function allIndicesOf(string, search) {
    let indices = [];
    for (let pos = string.indexOf(search); pos !== -1; pos = string.indexOf(search, pos + 1)) {
        indices.push(pos);
    }
    return indices;
}

function editDistance(s1, s2) {
    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

module.exports = {
    logger,
    jsonconfig,
    request,
    opt,
    allIndicesOf,

    globLogger,
    globConfig,

    editDistance,
    similarity
}