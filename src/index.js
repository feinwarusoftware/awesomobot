"use strict";

const mongoose = require("mongoose");

const Logger = require("./logger");

const genLogger = new Logger();

mongoose.connect("mongodb://localhost/rawrxd");
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", err => {
    genLogger.log("stderr", err);
});
db.on("open", () => {
    genLogger.log("stdout", "connected to db");
});

process.on("exit", code => {

    genLogger.fatalError(`process exited with code: ${code}`);
});

// do stuff
require("./bot");
require("./web");
