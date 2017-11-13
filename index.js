"use strict"

const config = require("./config/index");
const modules = require("./modules/index");

var path = require("path")
console.log(path.join(__dirname + "/../" + "test.txt"));

modules.bot.events.runBot();
