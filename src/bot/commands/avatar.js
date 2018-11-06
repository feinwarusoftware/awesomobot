"use strict";

const Command = require("../command");

const avatar = new Command({

    name: "Discord Avatar",
    description: "Sends your current discord avatar in chat",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099662204993536/avatar.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "avatar",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        let scaledSize = 512;

        let subMessage = message.content.substring(message.content.split(" ")[0].length + 1);
    
        let search = message.guild.members.array()
    
        if (subMessage !== undefined) {
            for (let i = 0; i < search.length; i++) {
                if (search[i].displayName === subMessage) {
                    let currentSize = parseInt(search[i].user.avatarURL.substring(search[i].user.avatarURL.indexOf("size=") + 5), 10);
                    if (currentSize === undefined) {
                        message.reply("so... the bot shit itself, blame dragon");
                    }
                    if (currentSize < scaledSize) {
                        scaledSize = currentSize;
                    }
    
                    message.reply(search[i].user.avatarURL.substring(0, search[i].user.avatarURL.indexOf("size=") + 5) + scaledSize);
                    return;
                }
    
            }
        }
        if (subMessage === "") {
            let currentSize = parseInt(message.author.avatarURL.substring(message.author.avatarURL.indexOf("size=") + 5), 10);
            if (currentSize === undefined) {
                message.reply("so... the bot shit itself, blame dragon");
            }
            if (currentSize < scaledSize) {
                scaledSize = currentSize;
            }
    
            message.reply(message.author.avatarURL.substring(0, message.author.avatarURL.indexOf("size=") + 5) + scaledSize);
            return;
        }
    }
});

module.exports = avatar;

