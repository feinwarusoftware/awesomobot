"use strict"

const discord = require("discord.js");

const spnav = require("../spnav");

const Command = require("../command");

const wikia = new Command("wikia", "search the south park wikia", "js", 0, "wikia", "command", 0, false, null, function(client, message, guildDoc){
    if (message.content.split(" ")[1] === undefined) {
        message.reply(`you're missing a query to search for, if you want to search for a random episode, use: ${guild.settings.prefix}r`);
    }

    const query = message.content.substring(message.content.indexOf(" ") + 1);

    spnav.wikiaSearch(query).then(result => {
        const embed = new discord.RichEmbed()
            .setColor(0xff594f)
            .setAuthor("AWESOM-O // " + result.title, "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png")
            .setURL(result.url)
            .setDescription(result.desc);

        if (result.thumbnail.indexOf(".png") !== -1) {
            embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".png") + 4));
        } else if (result.thumbnail.indexOf(".jpg") !== -1) {
            embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpg") + 4));
        } else if (result.thumbnail.indexOf(".jpeg") !== -1) {
            embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpeg") + 5));
        } else if (result.thumbnail.indexOf(".gif") !== -1) {
            embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".gif") + 4));
        } else {
            embed.setThumbnail(result.thumbnail);
        }

        message.channel.send(embed);

    }).catch(error => {
        message.reply(`fucking rip... ${error}`);
    });
});

module.exports = wikia;