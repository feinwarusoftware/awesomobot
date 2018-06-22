"use strict";

const Logger = require("./logger");

const genLogger = new Logger();

mongoose.connect("mongodb://localhost/rawrxd");
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", err => {
    logger.log(err);
});
db.on("open", () => {
    logger.log("connected to db");
});

// do stuff
