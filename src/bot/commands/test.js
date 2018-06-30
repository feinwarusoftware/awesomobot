"use strict";

const Command = require("../command");

const test = new Command("test", "testing...", "js", 0, "test", "command", 0, false, null, function(client, message, guildDoc) {
    message.reply("testing...") 
});

module.exports = test;
