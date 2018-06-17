"use strict";

const fs = require("fs");

const timeout = ms => new Promise(res => setTimeout(res, ms));

const loadJson = fp => {
    try {
        return JSON.parse(fs.readFileSync(fp));
    } catch(err) {
        console.err(err);
        return null;
    }
};

// stdout
const defStdout = process.stdout.write;

const hookStdout = cb => {

    process.stdout.write = function(write) {

        return cb(write);
    }(process.stdout.write);
};

const unhookStdout = () => {

    process.stdout.write = defStdout;
}

// stderr
const defStderr = process.stderr.write;

const hookStderr = cb => {

    process.stderr.write = function(write) {

        return cb(write);
    }(process.stderr.write)
}

const unhookStderr = () => {

    process.stderr.write = defStderr;
}

module.exports = {

    timeout,
    loadConfig,

    hookStdout,
    unhookStdout,

    hookStderr,
    unhookStderr
}
