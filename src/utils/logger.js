"use strict";

const LOG_INFO = 1
const LOG_WARNING = 2
const LOG_ERROR = 4
const LOG_DEBUG = 8

class Logger {
    constructor(loglevel) {
        this.level = loglevel
    }
    log(loglevel, message) {

        if (this.level & loglevel) {

            if (loglevel & LOG_INFO) {
                console.log("INFO >> "+message)
            }
            if (loglevel & LOG_WARNING) {
                console.log("\x1b[33m%s\x1b[0m", "WARNING >> "+message)
            }
            if (loglevel & LOG_ERROR) {
                console.log("\x1b[31m%s\x1b[0m", "ERROR >> "+message)
            }
            if (loglevel & LOG_DEBUG) {
                console.log("\x1b[35m%s\x1b[0m", "DEBUG >> "+message)
            }
        }
    }
    fatalError(message) {
        console.log("\x1b[36m%s\x1b[0m", "FATAL >> "+message)
        process.exit(1)
    }
}

module.exports = {
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR,
    LOG_DEBUG,
    Logger,   
};