"use strict"

const discord = require("discord.js");

const Command = require("../command");

const fuckyou = new Command({

    name: "Fuck You",
    description: "Can we copystrike Feinwaru?",
    thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/487740197497470976/unknown.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "fuckyou",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("", {
            file: "https://cdn.discordapp.com/attachments/379432139856412682/487740197497470976/unknown.png"
        });
    }
});

module.exports = fuckyou;
