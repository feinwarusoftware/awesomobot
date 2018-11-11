"use strict"

const Command = require("../script");

const dam = new Command({

    name: "I broke that dam",
    description: "No, I broke the dam",
    thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/509104533906128909/giphy.gif",
    marketplace_enabled: true,

    type: "js",
    match_type: "contains",
    match: "i broke the dam",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {

        message.reply("No, I broke the dam");
    }
});

module.exports = dam;
