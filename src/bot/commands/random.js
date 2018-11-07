"use strict"

const discord = require("discord.js");

const spnav = require("../spnav");

const Command = require("../command");

let cachedeplist = [];

const random = new Command({

    name: "Random South Park Episode",
    description: "Searches https://southpark.wikia.com/ for a random episode",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092423087947817/t4.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "random",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {
    
        const query = cachedeplist[Math.floor(Math.random() * cachedeplist.length)];
    
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
    },
    load: function() {
        return new Promise(async (resolve, reject) => {

            cachedeplist = await spnav.getEpList();

            resolve();
        });
    }
});

module.exports = random;

