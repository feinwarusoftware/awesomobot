"use strict"

const Command = require("../command");

const discord = require("discord.js");

const help = new Command("help", "filthy frank", "js", 0, "help", "command", 0, false, null, function(client, message, guildDoc) {
    message.channel.send(new discord.RichEmbed()
                .setAuthor("AWESOM-O // Help", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png")
                .setThumbnail("https://cdn.discordapp.com/attachments/437671103536824340/462652988222341131/matt-thinking-full.png")
                .setDescription("**Welcome to the AWESOM-O Discord bot!**\n\nIf you want more info, go to this [website.](https://awesomo.feinwaru.com)")
                .setFooter("These dev people are cool, I guess."));
});

module.exports = help;

