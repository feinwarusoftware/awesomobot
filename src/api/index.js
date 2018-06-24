"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const stream = require("stream");

const express = require("express");
const morgan = require("morgan");

const Logger = require("../logger");
const routes = require("./routes");

const apiLogger = new Logger();

const app = express();

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

app.use(morgan(config.env === "dev" ? "dev" : "combined", { stream: config.env === "aaa" ? undefined : new stream.Writable({
    write: (chunk, encoding, next) => {

        const string = chunk.toString();
        apiLogger.log("apilog", string.endsWith("\n") ? string.substring(0, string.length - 2) : string);
        next();
    }
}) }));

app.use(routes);

app.use((req, res, next) => {

    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {

    res.status(err.status || 500);
    res.json({ error: err.status || 500 });
});

const server = http.createServer(app);

server.on("error", err => {

    if (err.syscall !== "listen") {
        apiLogger.fatalError(`Could not start http server: ${err}`);
    }

    switch(err.code) {
        case "EACCES":
            apiLogger.fatalError(`Port ${config.api_port} requires elevated privileges`);
            break;
        case "EADDRINUSE":
            apiLogger.fatalError(`Port ${config.api_port} is already in use`);
            break;
        default:
            apiLogger.fatalError(`Could not start http server: ${err}`);
    }
});

server.on("listening", () => {
    apiLogger.log("stdout", `Magic happens on port ${config.api_port}`);
});

server.listen(config.api_port);
