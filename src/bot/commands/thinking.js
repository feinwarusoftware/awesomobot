"use strict"

const Command = require("../command");

const thinking = new Command("thinking", "things that make you go hmmm...", "js", 0, "hmmm", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.reply("Things that make you go <:mattthink:451843404721029120><:mattthink:451843404721029120><:mattthink:451843404721029120>");

});

module.exports = thinking;