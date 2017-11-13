"use strict"

const fs = require("fs");
const config = require("../../config/utils");

const format = config.fstream.format;

function readString(path, callback) {
    fs.readFile(path, format, function(err, data) {
        if (err) {
            // do something
            return;
        }

        callback(data);
    });
}

function writeString(path, string) {
    fs.writeFile(path, string + "\n", function(err) {
        if(err) {
            // do something
            return;
        }
    });
}

function appendString(path, string) {
    fs.appendFile(path, string + "\n", function(err) {
        if(err) {
            // do something
            return;
        }
    });
}

function clearFile(path) {
    fs.clearFile(path, function(err) {
        if (err) {
            // do something
            return;
        }
    });
}

function readJson(path, callback) {
    readString(path, function(data) {
        callback(JSON.parse(data));

    });
}

function writeJson(path, json) {
    try {
        writeString(path, JSON.stringify(json));

    } catch (e) {
        // do something

    }
}

function editJson(path, field, value) {
    const json = readJson(path, function(data) {
        try {
            json[field] = value;

        } catch (e) {
            // do something

        }
    });
}

function incrementJson(path, field, inc) {
    const json = readJson(path, function(data) {
        try {
            json[field] += inc;
            writeJson(path, json);

        } catch (e) {
            // do something

        }        
    });
}

module.exports = {
    readString,
    writeString,
    appendString,
    clearFile,
    readJson,
    writeJson,
    editJson,
    incrementJson,

}