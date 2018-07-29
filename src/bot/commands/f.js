"use strict"

const Command = require("../command");

const f = new Command("f", "repects", "js", 0, "f", "command", 0, false, null, function(client, message, guildDoc){
    message.reply("Repects have been paid.");
});

module.exports = f;