"use strict"

const Command = require("../command");

const dice = new Command({

    name: "Dice",
    description: "Not the vidya games company",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092305849024534/t9.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "dice",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        message.reply(Math.floor(Math.random() * 6) + 1);
    }
});

module.exports = dice;
