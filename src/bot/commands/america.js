"use strict"

const Command = require("../command");

const discord = require("discord.js");

const america = new Command({

    name: "This is America",
    description: "I thought this was America!",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092380083879945/t26.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "america",

    featured: false,

    cb: function (client, message, guildDoc) {

        let randomnumber = Math.random();
        if (randomnumber < 0.95) {
            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("http://i0.kym-cdn.com/photos/images/original/001/234/287/e06.gif"));
        } else {
            message.reply("https://www.youtube.com/watch?v=VYOjWnS4cMY");
        }
    }
});

module.exports = america;
