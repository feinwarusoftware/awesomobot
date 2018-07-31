"use strict"

const Command = require("../command");

const discord = require("discord.js");

const america = new Command("america", "I thought this is America!", "js", 0, "america", "command", 0, false, null, function(client, message, guildDoc) {
    let randomnumber = Math.random();
        if (randomnumber < 0.95) {
            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("http://i0.kym-cdn.com/photos/images/original/001/234/287/e06.gif"));
        } else {
            message.reply("https://www.youtube.com/watch?v=VYOjWnS4cMY");
        }
});

module.exports = america;