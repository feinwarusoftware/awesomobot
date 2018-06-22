"use strict";

const schemas = require("./db");

class Logger {
    log(type, message) {
        if (type === "stderr") {
            console.error(message);
        } else {
            console.log(message);
        }

        const newLog = new schemas.LogSchema({
            type,
            message
        });

        newLog.save().catch(err => {
            console.error(`could not save log to db: type - ${type}, message - ${message}, err - ${err}`);
        });
    }
    error(message) {
        this.log("stderr", message);
    }
}

module.exports = Logger;
