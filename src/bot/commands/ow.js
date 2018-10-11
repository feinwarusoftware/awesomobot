"use strict"

const Command = require("../command");

const ow = new Command({

    name: "Overwatch Stats",
    description: "Do what the title says",
    thumbnail: "https://i.kym-cdn.com/entries/icons/mobile/000/017/039/pressf.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "ow",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("Repects have been paid.");
    }
});

module.exports = ow;
