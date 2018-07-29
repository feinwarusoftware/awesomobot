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
            .setColor(0x8bc34a)
            .setAuthor("AWESOM-O // " + result.title, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
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