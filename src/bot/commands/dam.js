"use strict"

const Command = require("../command");

const dam = new Command({

    name: "I broke that dam",
    description: "No, I broke the dam",
    thumbnail: "https://media.giphy.com/media/l2SpRYFoEozfcFa24/giphy.gif",
    marketplace_enabled: true,

    type: "js",
    match_type: "contains",
    match: "i broke the dam",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("No, I broke the dam");
    }
});

module.exports = dam;
