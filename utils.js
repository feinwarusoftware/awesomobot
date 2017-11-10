/**
 * Utility commands that don't necessarily deserve their own module.
 */

const fs = require("fs");
const moment = require("moment");

module.exports = {
    opt: function(options, name, def) {
        return options && options[name]!==undefined ? options[name] : def;
    },

    logString: function(fpath, str) {
        fs.appendFile(fpath, str + "\n", function(err) {
            if(err) {
                console.error("Could not write file: %s", err);
                return;
            }
        });
    },

    logMessage: function(fpath, message) {
        fs.appendFile(fpath, moment().format("MMMM Do YYYY, h:mm a") + " [" + message.author.id + "]" + " (" + message.channel.name + ") " + message.author.username + " --> " + message.content + "\n", function(err) {
            if(err) {
                console.error("Could not write file: %s", err);
                return;
            }
        });
    },

    readFile: function(fpath, callback) {
        fs.readFile(fpath, "utf8", function(err, data) {
            if(err) {
                console.error("Could not read file: %s", err);
                return;
            }

            callback(data);
        });
    },

    messageIncludes: function(message, array) {
        for (var i = 0; i < array.length; i++) {
            if (message.content.toLowerCase().includes(array[i])) {
                return true;
            }
        }
        return false;
    }
}