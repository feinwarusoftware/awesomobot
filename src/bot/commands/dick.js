"use strict"

const discord = require("discord.js");

const Command = require("../command");

const dick = new Command({

    name: "Dick",
    description: "Can we copystrike Feinwaru?",
    thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/487740674133852162/unknown.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "dick",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("", {
            file: "https://cdn.discordapp.com/attachments/379432139856412682/487740674133852162/unknown.png"
        });
    }
});

module.exports = dick;
