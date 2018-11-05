"use strict";

const discord = require("discord.js");

const Command = require("../command");

let reminder = new Command({

    name: "Towelie's Reminder",
    description: "You all know the words kids!",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092420240015381/t3.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "reminder",

    featured: false,

    cb: function (client, message, guildDoc) {

        let random = Math.random();
        console.log(random);
        if (random >= 0.8) {
            message.channel.send("**DON'T TRUST THE GOVERNMENT!**");
        } else {
            message.channel.send("*Don't forget to bring a towel!*");
        }
    }
});

module.exports = reminder;