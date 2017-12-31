"use strict"

const mongoose = require("mongoose");

const webserver = require("./src/web/server");
const bot = require("./src/bot/main");

// connect to mongodb
// pls fix
mongoose.connect("mongodb://localhost/test2");

// start the webserver
webserver();

// start the bot
bot();
