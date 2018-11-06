"use strict"

const Command = require("../command");

const random = new Command({

    name: "Random South Park Episode",
    description: "Searches https://southpark.wikia.com/ for a random episode",
    thumbnail: "",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "random",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        if (cachedeplist === undefined) {

            spnav.getEpList().then(result => {
                cachedeplist = result;
                this.cb(client, message, guildDoc);
    
            }).catch(error => {
                message.reply(`fucking rip... ${error}`);
            });
    
            return;
        }
    
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
    }
});

module.exports = random;

