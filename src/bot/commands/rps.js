"use strict"

const Command = require("../command");

const rps = new Command({

    name: "Rock, Paper, Scissors",
    description: "Mate, do I even have to explain...",
    thumbnail: "http://d13z1xw8270sfc.cloudfront.net/origin/430481/1511471015563_cheater1.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "rps",

    featured: false,

    cb: function(client, message, guildDoc) {

        const rand = Math.floor(Math.random() * 3);
        message.reply(rand === 0 ? "Rock" : rand === 1 ? "Paper" : "Scissors");
    }
});

module.exports = rps;
