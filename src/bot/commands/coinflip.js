"use strict"

const Command = require("../command");

const coinflip = new Command({

    name: "Coin Flip",
    description: "Flip a coin",
    thumbnail: "https://images-na.ssl-images-amazon.com/images/I/71zkn4UyOPL._SX466_.jpg",
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
