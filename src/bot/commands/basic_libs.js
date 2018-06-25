"use strict";

const Command = require("../command");

const lib = require("./libs/basic");

const basic_libs = new Command("basic_libs", "basic external lib loading command example for the new awesomo backend", "js" /* currently unused */, 0 /* currently unused */, "basic_libs", "command", null, (client, message, guildDoc) => {

    message.reply(lib.say_hello());
});

module.exports = basic_libs;
