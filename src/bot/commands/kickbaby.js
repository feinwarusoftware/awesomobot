"use strict"

const Command = require("../command");

const kickbaby = new Command("kickbaby", "kicks the baby", "js", 0, "kick the baby", "startswith", 0, false, null, function(client, message, guildDoc) {
 
    message.reply("Don't kick the goddamn baby!");

});

//module.exports = kickbaby;