"use strict";

const Command = require("../command");

const test = new Command("test", "testing...", "js", 0, "r", "command", 1, false, null, (client, message, guildDoc) => {

    message.reply("testing...");
});

module.exports = test;
