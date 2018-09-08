"use strict"

const discord = require("discord.js")

const Command = require("../command");

const colour = new Command({

    name: "Feinwaru Colour",
    description: "Learn your overlord's colour",
    thumbnail: "https://pbs.twimg.com/profile_images/959181051112382464/M6OKsgM1.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "colour",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("The Feinwaru colour is: **0xff594f**"));
    }
});

module.exports = colour;
