"use strict"

/*
const mongoose = require("mongoose");

const webserver = require("./src/web/server");
const bot = require("./src/bot/main");

// connect to mongodb
// yay its fixed!
const mongoDB = "mongodb://localhost/test2";
mongoose.connect(mongoDB, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// start the webserver
webserver();

// start the bot
bot.start();
*/

require("./src/bot-new");

require("./src/web/server")();
