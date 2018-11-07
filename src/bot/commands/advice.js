"use strict"

const Command = require("../command");

const advice = new Command({

    name: "AWESOM-O Advice",
    description: "Advice straight from the Robot's Vocal Simulator™",
    thumbnail: "https://cdn.discordapp.com/attachments/430447280932388865/474253854465196042/headerawesomo.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "advice",

    featured: false,

    preload: true,

    cb: function (client, message, guildDoc) {

        let advice = [
            "Stop being so lame. It's not kewl.",
            "Kill all jews... and gingers...",
            "Respect Eric Cartman. He is totally cool and not at all lame.",
            "Kid picking on you? Turn their parents into chili and feed it to them.",
            "Not invited to a party? Trick the most gullible kid.",
            "Need a superhero? Call on the Coon! He is the saviour this town needs!",
            "Have no idea what to do? Think: What would Brian Boitano do?"
        ];
        let advicerandom = advice[Math.floor(Math.random() * advice.length)];
        message.reply("**Here's some advice:** " + advicerandom);
    }
});

module.exports = advice;
