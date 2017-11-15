/**
 * jlite.js
 * Desc: Used for database like storage in json files.
 * Deps: I really dont care
 */

"use strict"

const fs = require("fs");

function readJson(path, callback) {
    fs.readFile(path, function(err, data) {
        if (err) {
            callback(null, err);
            return;
        }

        try {
            const json = JSON.parse(data);
            callback(json, false);
            
        } catch(e) {

            callback(null, true);
            return;
        }
    });
}

function writeJson(path, json, callback) {
    fs.writeFile(path, JSON.stringify(json), function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

module.exports = {
    readJson,
    writeJson,

};