"use strict"

const discord = require("discord.js");

const Command = require("../command");

const dick = new Command("dick", "Stop being a dick Scott", "js", 0, "dick", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif"));

});

module.exports = dick;