"use strict"

const Command = require("../command");

const rps = new Command("rps", "wonks", "js", 0, "rps", "command", 0, false, null, function(client, message, guildDoc) {
 
    const rand = Math.floor(Math.random() * 3);
            message.reply(rand === 0 ? "Rock" : rand === 1 ? "Paper" : "Scissors");
});

//module.exports = rps;