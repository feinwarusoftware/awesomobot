"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

const express = require("express");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const ejs = require("ejs");
const i18n = require("i18n-express");

const app = express();
const server = http.createServer(app);

const routes = require("./routes");

let config;
try {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
} catch (error) {
    console.error(error);
}
if (config === undefined || config.env === undefined || config.port === undefined) {
    console.error("config file data error");
    return;
}

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.use(logger(config.env === "dev" ? "dev" : "common"));
app.use(sassMiddleware({
    root: path.join(__dirname, "static"),
    src: "/scss",
    dest: "/css",
    indentedSyntax: false, // true: sass, false: scss.
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, "static")));

app.use(i18n({
    translationsPath: path.join(__dirname, 'translations'), // <--- use here. Specify translations files path.
    siteLangs: ["en","ie","es","pt"],
    paramLangName: "lang",
    textsVarName: 'trans'
}));

app.use(routes);

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        return res.render("404");
    }

    res.locals.message = err.message;
    res.locals.error = config.env === "dev" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

server.on("error", (err) => {
    if (err.syscall !== "listen") {
        throw err;
    }

    let bind = typeof port === "string" ?
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
    let addr = server.address();
    let bind = typeof addr === "string" ?
        "pipe " + addr :
        "port " + addr.port;
    console.log("Magic happens on port " + bind);
});

server.listen(config.port);
