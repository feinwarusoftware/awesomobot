"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const stream = require("stream");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const i18n = require("i18n-express");
const ejs = require("ejs");

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

app.enable("trust proxy");

app.use(morgan(config.env === "dev" ? "combined" : "combined", { stream: new stream.Writable({
    write: (chunk, encoding, next) => {

        const string = chunk.toString();
        apiLogger.log("apilog", string.endsWith("\n") ? string.substring(0, string.length - 2) : string);
        next();
    }
}) }));

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());
app.use(cookieParser(config.rawrxd));

app.use(i18n({
    defaultLang: "en",
    translationsPath: path.join(__dirname, 'translations'),
    siteLangs: ["en","ga","es","pt-pt","zh-tw","ro","ni", "pl"],
    paramLangName: "hl",
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

const server = http.createServer(app);

server.on("error", err => {

    if (err.syscall !== "listen") {
        apiLogger.fatalError(`Could not start http server: ${err}`);
    }

    switch(err.code) {
        case "EACCES":
            apiLogger.fatalError(`Port ${config.port} requires elevated privileges`);
            break;
        case "EADDRINUSE":
            apiLogger.fatalError(`Port ${config.port} is already in use`);
            break;
        default:
            apiLogger.fatalError(`Could not start http server: ${err}`);
    }
});

server.on("listening", () => {
    apiLogger.log("stdout", `Magic happens on port ${config.port}`);
});

server.listen(config.port);
