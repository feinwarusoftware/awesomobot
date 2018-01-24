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
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Times");
    embed.addField("PST", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("EST", momentTz().tz("America/New_York").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("GMT", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("CST", momentTz().tz("Asia/Hong_Kong").format("Do MMMM YYYY, h:mm:ss a"));
    embed.setThumbnail("https://cdn.discordapp.com/attachments/379432139856412682/401485874040143872/hmmwhatsthetime.png");

    return embed;
}

function info(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Info", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail("https://vignette.wikia.nocookie.net/southpark/images/6/6d/Awesomo-0.png/revision/latest?cb=20170601014435")
    embed.setTitle("Your all purpose South Park Bot!")
    embed.addField("-help for a list of commands", "If a command is missing, feel free to inform us")
    embed.addField("Crafted with love by Dragon1320 and Mattheous. ♥", "Additional credit goes out to SmashRoyale for the amazing art")
    embed.addField("Online Dashboard", "https://awesomobot.com/")
    embed.setFooter("This bot is pretty schweet!");

    return embed;
}

function help(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Help", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail("https://images.emojiterra.com/twitter/512px/1f914.png")
    embed.addField("List of Commands", "https://awesomobot.com/commands")
    embed.addField("Help & Support", "https://help.awesomobot.com/")
    embed.setFooter("These dev people are very helpful!");

    return embed;
}

function harvest(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Harvest", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setImage("http://diymag.com/media/img/Artists/D/Dua_Lipa/_1500x1000_crop_center-center_75/Dua-Lipa-4-lo-res-1.jpg")
    embed.setTitle("Dua Lipa")
    embed.setDescription("Dua Lipa is an English singer, songwriter, and model. Her musical career began at age 14, when she began covering songs by other artists on YouTube. In 2015, she was signed with Warner Music Group and released her first single soon after. In December 2016, a documentary about Lipa was commissioned by The Fader magazine, titled See in Blue.")
    embed.setFooter("Ave, ave versus christus!")
    embed.setURL("https://youtu.be/6H3UiwU1N5I?t=3m2s");
    return embed;
}

module.exports = {
    deletion,
    times,
    info,
    help,
    harvest
};
