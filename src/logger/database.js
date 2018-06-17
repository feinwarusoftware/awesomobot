"use strict";

const { Logger } = require("./common");

const LOG_TYPE = {

    STDOUT: "stdout",
    STDERR: "stderr"
};

class DatabaseLogger extends Logger {
    constructor(db) {

        this.db = db;
    }
    log(message, type = LOG_TYPE.STDOUT) {
        super.log(message);

        this.db.addBotLog(message, type).catch(err => {
            super.error(err);
        });
    }
    error(message) {
        super.error(message);

        this.log(message, LOG_TYPE.STDERR);
    }
}

module.exports = {

    LOG_TYPE,
    DatabaseLogger
};
