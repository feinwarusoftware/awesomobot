"use strict"

const config = {
    flog: {
        level: 0,
        info: 1,
        warning: 2,
        error: 4,
        debug: 8,
        console: __dirname + "/../" + "data/logs/console.txt",
        chat: __dirname + "/../" + "data/logs/chat.txt",

    },

    fstream: {
        format: "utf8",

    },

};

module.exports = config;