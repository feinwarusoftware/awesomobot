"use strict"

const colors = require("colors");

const fstream = require("./fstream");
const config = require("../../config/utils");

const level = config.flog.level;
const info = config.flog.info;
const warning = config.flog.warning;
const error = config.flog.error;
const debug = config.flog.debug;

function console(logLevel, string, source = __filename, location = __dirname) {
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

function file(logLevel, string, source = __filename, location = __dirname) {
    if (logLevel & level) {
        const fileName = source.substring(source.lastIndexOf("\\") + 1, source.length);

        switch(logLevel) {
            case info:
                fstream.appendString(location + "/log.txt", "INFO" + " >> [" + fileName + "] --> " + string);
                break;
            case warning:
                fstream.appendString(location + "/log.txt", "WARNING" + " >> [" + fileName + "] --> " + string);
                break;
            case error:
                fstream.appendString(location + "/log.txt", "ERROR" + " >> [" + fileName + "] --> " + string);
                break;
            case debug:
                fstream.appendString(location + "/log.txt", "DEBUG" + " >> [" + fileName + "] --> " + string);
                break;
        }
    }
}

function both(logLevel, string, source = __filename, location = __dirname) {
    this.console(logLevel, string, source, location);
    file(logLevel, string, source, location);
}

function clear(source = __filename, location = __dirname) {
    fstream.clearFile(source);
}

module.exports = {
    console,
    file,
    both,
    clear,

};