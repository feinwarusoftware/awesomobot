"use strict";

const path = require("path");
const http = require("http");

const express = require("express");
const logger = require("morgan");
const ejs = require("ejs");

const app = express();
const server = http.createServer(app);

const port = 80;
const env = "dev";

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.use(logger(env));
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.render("index");
});

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = env === "dev" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

server.on("error", (err) => {
    if (err.syscall !== "listen") {
        throw err;
    }

    const bind = typeof port === "string" ?
        "Pipe " + port :
        "Port " + port;

    switch (err.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw err;
    }
});

server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ?
        "pipe " + addr :
        "port " + addr.port;
    console.log("Magic happens on port " + bind);
});

server.listen(port);
