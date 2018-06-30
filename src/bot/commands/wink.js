"use strict"

const Command = require("../command");

const wink = new Command("wink", "wonks", "js", 0, "wink", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.reply("**wonk**");

});

module.exports = wink;