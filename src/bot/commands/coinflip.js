"use strict"

const Command = require("../command");

const coinflip = new Command({

    name: "Coin Flip",
    description: "Flip a coin",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092339680280626/t18.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "coinflip",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply(Math.floor(Math.random() * 2) === 0 ? "heads" : "tails");
    }
});

module.exports = coinflip;
