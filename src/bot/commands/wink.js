"use strict"

const Command = require("../command");

const wink = new Command({
    
    name: "wink",
    description: "wonk",
    thumbnail: "https://thumbs.gfycat.com/DependentSpiritedAmurminnow-poster.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "wink",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("wonk");
    }
});

module.exports = wink;
