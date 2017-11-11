/**
 * Utility commands that don't necessarily deserve their own module.
 */

const fs = require("fs");
const moment = require("moment");
const log = require("./log");
const debug = require("./debug");

module.exports = {
    opt: function(options, name, def) {
        return options && options[name]!==undefined ? options[name] : def;
    },

    messageIncludes: function(message, array) {
        for (var i = 0; i < array.length; i++) {
            if (message.content.toLowerCase().includes(array[i])) {
                return true;
            }
        }
        return false;
    },

    // Deprecated - will be removed in the next patch.
    logString: function(fpath, str) {
        log.write(log.WARNING, "Function 'utils.logString()' is deprecated and will be removed in the next patch; use file.writeString() instead.", __function, __line);
        //console.log("WARNING >> Function 'utils.logString()' is deprecated and will be removed in the next patch; use file.writeString() instead.");
        fs.appendFile(fpath, str + "\n", function(err) {
            if(err) {
                console.error("Could not write file: %s", err);
                return;
            }
        });
    },

    // Deprecated - will be removed in the next patch.
    logMessage: function(fpath, message) {
        log.write(log.WARNING, "Function 'utils.logMessage()' is deprecated and will be removed in the next patch; use file.writeMessage() instead.", __function, __line);
        //console.log("WARNING >> Function 'utils.logMessage()' is deprecated and will be removed in the next patch; use file.writeMessage() instead.");
        fs.appendFile(fpath, moment().format("MMMM Do YYYY, h:mm a") + " [" + message.author.id + "]" + " (" + message.channel.name + ") " + message.author.username + " --> " + message.content + "\n", function(err) {
            if(err) {
                console.error("Could not write file: %s", err);
                return;
            }
        });
    },

    // Deprecated - will be removed in the next patch.
    readFile: function(fpath, callback) {
        log.write(log.WARNING, "Function 'utils.readFile()' is deprecated and will be removed in the next patch; use file.readAsString() instead.", __function, __line);
        //console.log("WARNING >> Function 'utils.readFile()' is deprecated and will be removed in the next patch; use file.readAsString() instead.");
        fs.readFile(fpath, "utf8", function(err, data) {
            if(err) {
                console.error("Could not read file: %s", err);
                return;
            }

            callback(data);
        });
    }
}