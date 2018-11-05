"use strict";

const Command = require("../command");

const discord = require("discord.js");

let towelquote = new Command({

    name: "Towelie Quotes",
    description: `"Don't forget to bring a towel!"`,
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092516969316362/t19.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "towelq",

    featured: false,

    cb: function(client, message, guildDoc) {

        const quotes = [
            "*Don't forget to bring a towel!*",
            "*You wanna get high?*",
            "*I have no idea what is going on.*",
            "*You're a towel!*",
            "*Don't preach to me, fatso.*",
            "*Thats it! Thats the melody to Funkytown.*",
            "*So am I to understand that there's been a TOWELIE-BAN?*",
            "*My name is Towelie. T-O-W-E-L...Y-E-Y.*",
            "*Well, you're a beaner towel.*",
            "*Don't call me shoeless! You're shoeless!*",
            "*I should come up with ideas and then get high to reward myself.*",
            "*I'll just use my special gettin' high powers one more time!*",
            "*I feel like I could conquer the world!*",
            "*It's like i'm walkin' on sunshine!*",
            "*GO AWAY I'M WALKIN' ON SUNSHINE!!*",
            "*Would you like to get your dick sucked by a towel?*",
            "*No, i'm not high! I haven't been high since Wednesday! ...Oh...Oh it is Wednesday?*",
            "*I'm just an ordinary towel in a lot of ways... Except for one. I'm addicted to marijuana.*"
        ];
        const random = Math.floor(Math.random() * quotes.length);
        message.channel.send(quotes[random]);
    }
});

module.exports = towelquote;
