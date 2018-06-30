"use strict"

const Command = require ("../command");

let repects = new Command ("repects", "press f to pay repects", "js", 0, "f", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.reply("Repects have been paid");
});

module.exports = repects;