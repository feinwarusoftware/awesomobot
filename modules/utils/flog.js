"use strict"

const colors = require("colors");
const moment = require("moment");

const fstream = require("./fstream");
const config = require("../../config/utils");

const level = config.flog.level;
const info = config.flog.info;
const warning = config.flog.warning;
const error = config.flog.error;
const debug = config.flog.debug;

function console(logLevel, string, source = __filename) {
    if (logLevel & level) {
        const fileName = source.substring(source.lastIndexOf("\\") + 1, source.length);

        switch(logLevel) {
            case info:
                console.log("INFO".green + " >> [" + fileName + "] --> " + string);
                break;
            case warning:
                console.log("WARNING".yellow + " >> [" + fileName + "] --> " + string);
                break;
            case error:
                console.log("ERROR".red + " >> [" + fileName + "] --> " + string);
                break;
            case debug:
                console.log("DEBUG".magenta + " >> [" + fileName + "] --> " + string);
                break;
        }
    }
}

function file(logLevel, string, logpath = config.flog.console, source = __filename) {
    if (logLevel & level) {
        const fileName = source.substring(source.lastIndexOf("\\") + 1, source.length);

        switch(logLevel) {
            case info:
                fstream.appendString(logpath + "/log.txt", "INFO" + " >> [" + fileName + "] --> " + string);
                break;
            case warning:
                fstream.appendString(logpath + "/log.txt", "WARNING" + " >> [" + fileName + "] --> " + string);
                break;
            case error:
                fstream.appendString(logpath + "/log.txt", "ERROR" + " >> [" + fileName + "] --> " + string);
                break;
            case debug:
                fstream.appendString(logpath + "/log.txt", "DEBUG" + " >> [" + fileName + "] --> " + string);
                break;
        }
    }
}

function both(logLevel, string, logpath = config.flog.console, source = __filename) {
    this.console(logLevel, string);
    file(logLevel, string, logpath);
}

function message(message, logpath = config.flog.chat) {
    fstream.appendString(logpath, moment().format("MMMM Do YYYY, h:mm a") + " [" + message.author.id + "]" + " (" + message.channel.name + ") " + message.author.username + " --> " + message.content);
}

function clear(logpath) {
    fstream.clearFile(source);
}

module.exports = {
    console,
    file,
    both,
    clear,
    message,

};