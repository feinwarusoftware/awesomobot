"use strict"

const Command = require("../command");

const batman = new Command({

    name: "Batman",
    description: "na na na na na na na na",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092330213605376/t16.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "batman",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {

        message.channel.send("", {
            file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
        });
    }
});

module.exports = batman;
