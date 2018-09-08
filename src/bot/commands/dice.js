"use strict"

const Command = require("../command");

const dice = new Command({

    name: "Dice",
    description: "Not the vidya games company",
    thumbnail: "https://wherethewindsblow.com/wp-content/uploads/2015/07/Solid-Red-Dice-set-of-2.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "dice",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply(Math.floor(Math.random() * 6) + 1);
    }
});

module.exports = dice;
