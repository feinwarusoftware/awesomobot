"use strict";

const discord = require("discord.js");
const moment = require("moment");
const momentTz = require("moment-timezone");

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
function times(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0xf44336);
    embed.setAuthor("AWESOM-O // Times");
    embed.addField("PST", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("EST", momentTz().tz("America/New_York").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("GMT", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("CST", momentTz().tz("Asia/Hong_Kong").format("Do MMMM YYYY, h:mm:ss a"));
    embed.setThumbnail("https://cdn.discordapp.com/attachments/379432139856412682/401485874040143872/hmmwhatsthetime.png");

    return embed;
}

function times(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0xf44336);
    embed.setAuthor("AWESOM-O // Times");
    embed.addField("PST", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("EST", momentTz().tz("America/New_York").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("GMT", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("CST", momentTz().tz("Asia/Hong_Kong").format("Do MMMM YYYY, h:mm:ss a"));
    embed.setThumbnail("https://images.emojiterra.com/twitter/512px/1f914.png");

    return embed;
}

module.exports = {
    deletion,
    times
};
