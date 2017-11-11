/**
 * Logging helper functions.
 */

const colors = require("colors");
const debug = require("./debug");
const file = require("./file");

const clogfp = "./data/clog.txt";

const DEBUG = 1;
const WARNING = 2;
const ERROR = 4;
const INFO = 8;
const FILEDUMP = 16;

var logLevel = INFO;

function setLogLevel(level) {
    logLevel = level;
}

function getLogLevel() {
    return logLevel;
}

function write(level, string, fn = "undef", ln = "undef") {
    if (level & logLevel) {
        logMessage = "";
        switch (level) {
            case DEBUG:
                logMessage = "DEBUG" + " >> " + "[" + fn + ", " + ln + "] --> " + string;
                console.log("DEBUG".magenta +  " >> " + "[" + fn + ", " + ln + "] --> " + string);
                break;
            case WARNING:
                logMessage = "WARNING" + " >> " +  "[" + fn + ", " + ln + "] --> " + string;
                console.log("WARNING".yellow + " >> " +  "[" + fn + ", " + ln + "] --> " + string);
                break;
            case ERROR:
                logMessage = "ERROR" + " >> " +  "[" + fn + ", " + ln + "] --> " + string;
                console.log("ERROR".red + " >> " +  "[" + fn + ", " + ln + "] --> " + string);
                break;
            case INFO:
                logMessage = "INFO" + " >> " +  "[" + fn + ", " + ln + "] --> " + string;
                console.log("INFO".green + " >> " +  "[" + fn + ", " + ln + "] --> " + string);
                break;
        }

        if ((logMessage != "") && (FILEDUMP & logLevel)) {
            file.writeString(clogfp, logMessage);
        }
    }
}

module.exports = {
    DEBUG,
    WARNING,
    ERROR,
    INFO,
    FILEDUMP,
    setLogLevel,
    getLogLevel,
    write
}