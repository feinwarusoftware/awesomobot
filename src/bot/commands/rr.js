"use strict"

const discord = require("discord.js");

const Command = require("../command");

const rr = new Command("rr", "the ultimate life and death test", "js", 0, "rr", "command", 0, false, null, function (client, message, guildDoc) {
    let random = Math.random();
    console.log(random);
    if (random >= 0.83) {
        message.channel.send((new discord.RichEmbed().setColor(0xff594f).setDescription("*pulls trigger*\n\n**BANG!**\n\nUnlucky... You died...").setThumbnail("https://cdn.discordapp.com/attachments/452632364238110721/458361435639119893/skull_PNG72.png")));
    } else {
        message.channel.send((new discord.RichEmbed().setColor(0X7289DA).setDescription("*pulls trigger*\n\n***click***\n\nYou lived! Congratulations!").setThumbnail("https://cdn.discordapp.com/attachments/452632364238110721/458361437832871947/Green-Tick-PNG-Picture.png")));
    }
});

module.exports = rr;