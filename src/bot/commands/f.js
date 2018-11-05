"use strict"

const Command = require("../command");

const f = new Command({

    name: "Press F To Pay Respects",
    description: "Do what the title says",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092323355918336/t14.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "f",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("Repects have been paid.");
    }
});

module.exports = f;
