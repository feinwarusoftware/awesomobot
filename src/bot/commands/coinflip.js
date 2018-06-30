"use strict"

const Command = require("../command");

const coinflip = new Command("coinflip", "wonks", "js", 0, "coinflip", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.reply(Math.floor(Math.random() * 2) === 0 ? "heads" : "tails");

});

module.exports = coinflip;