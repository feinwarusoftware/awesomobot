"use strict"

const Command = require("../command");

const wink = new Command({
    
    name: "wink",
    description: "wonk",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png",
    marketplace_enabled: false,

    type: "js",
    match_type: "command",
    match: "wink",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("wonk");
    }
});

module.exports = wink;