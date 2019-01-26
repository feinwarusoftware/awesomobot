"use strict";

const path = require("path");
const http = require("http");
const stream = require("stream");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const i18n = require("i18n-express");
const ejs = require("ejs");

const mongoose = require("mongoose");

const { log: { info, error } } = require("../utils");
const routes = require("./routes");

const app = express();

const config = require("../../config.json");

//
mongoose.connect(`mongodb://${config.mongo_user === null && config.mongo_pass === null ? "" : `${config.mongo_user}:${config.mongo_pass}@`}localhost/rawrxd`, {
  useNewUrlParser: true,
  ...config.mongo_user === null && config.mongo_pass === null ? {} : {
    auth: {
      authdb: "admin"
    }
  }
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", err => {

  error(`error connecting to mongo: ${err}`);
});
db.on("open", () => {

  info("connected to mongo");
});
//

app.enable("trust proxy");

app.use(morgan(config.env === "dev" ? "combined" : "combined", { stream: new stream.Writable({
  write: (chunk, encoding, next) => {

    const string = chunk.toString();
    info(string.endsWith("\n") ? string.substring(0, string.length - 2) : string);
    next();
  }
}) }));

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());
app.use(cookieParser(config.cookie_secret));

app.use(i18n({
  defaultLang: "en",
  translationsPath: path.join(__dirname, "translations"),
  siteLangs: ["en","de","pt", "pl", "en-ni"],
  paramLangName: "hl",
  textsVarName: "trans"
}));

app.use(routes);

app.use((req, res, next) => {

  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {

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
    error(`Could not start http server: ${err}`);
    process.exit(-1);
  }

  switch(err.code) {
  case "EACCES":
    error(`Port ${config.port} requires elevated privileges`);
    process.exit(-1);
    break;
  case "EADDRINUSE":
    error(`Port ${config.port} is already in use`);
    process.exit(-1);
    break;
  default:
    error(`Could not start http server: ${err}`);
    process.exit(-1);
  }
});

server.on("listening", () => {
  info(`Magic happens on port ${config.port}`);
});

server.listen(config.port);
