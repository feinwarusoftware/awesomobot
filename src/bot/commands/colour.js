"use strict"

const discord = require("discord.js")

const Command = require("../command");

const colour = new Command("colour", "0xff594f", "js", 0, "colour", "command", 0, false, null, function(client, message, guildDoc){
    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("The Feinwaru colour is: **0xff594f**"));
});

module.exports = colour;

