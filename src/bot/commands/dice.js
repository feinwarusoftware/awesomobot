"use strict"

const Command = require("../command");

const dice = new Command("dice", "roll a digital dice", "js", 0, "dice", "command", 0, false, null, function(client, message, guildDoc){
    message.reply(Math.floor(Math.random() * 6) + 1);
});

module.exports = dice;