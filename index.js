"use strict"

const webserver = require("./src/web/server");
const bot = require("./src/bot/main");

// connect to mongodb


// start the webserver
webserver();

// start the bot
bot();
