"use strict"

const discord = require("discord.js");

const Command = require("../command");
const spnav = require("../spnav");

let cachedeplist;

const random = new Command("random", "random episodes", "js", 0, "random", "command", 0, false, null, function(client, message, guildDoc){
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

module.exports = random;