"use strict"

const Command = require("../command");

const batman = new Command({

    name: "Batman",
    description: "na na na na na na na na",
    thumbnail: "https://78.media.tumblr.com/tumblr_m69aybXOg71r6bzymo1_400.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "batman",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("", {
            file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
        });
    }
});

module.exports = batman;
