"use strict";

const discord = require("discord.js");

function deletion(message) {

    let embed = new discord.RichEmbed();
    const avatarUrl = message.author.avatarURL;

    embed.setColor(0xf44336);
    embed.setAuthor("AWESOM-O // log-deletion", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
    embed.addField("**Author:**", "<@" + message.author.id + ">");
    embed.addField("**Channel:**", "<#" + message.channel.id + ">");

    if (message.content) {
        embed.addField("**Message:**", message.content);
    } else {
        embed.addField("**Attachment:**", message.attachments.array()[0].url);
    }
    
    embed.setThumbnail(avatarUrl.substring(0, avatarUrl.length - 4) + "512");

    return embed;
}

module.exports = {
    deletion
};
