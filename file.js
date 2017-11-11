/**
 * File io helper functions.
 */

const fs = require("fs");
const moment = require("moment");

const format = "utf8";

function readAsString(path, callback) {
    fs.readFile(path, format, function(err, data) {
        if(err) {
            console.error("Could not read file: %s", err);
            return;
        }

        callback(data);
    });
}

function writeString(path, string) {
    fs.appendFile(path, string + "\n", function(err) {
        if(err) {
            console.error("Could not append file: %s", err);
            return;
        }
    });
}

function writeMessage(path, message) {
    fs.appendFile(path, moment().format("MMMM Do YYYY, h:mm a") + " [" + message.author.id + "]" + " (" + message.channel.name + ") " + message.author.username + " --> " + message.content + "\n", function(err) {
        if(err) {
            console.error("Could not append file: %s", err);
            return;
        }
    });
}

module.exports = {
    readAsString,
    writeString,
    writeMessage
}