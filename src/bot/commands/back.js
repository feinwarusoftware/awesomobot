"use strict"

const Command = require("../command");

const back = new Command({

    name: "I'm Back!",
    description: "^^^",
    thumbnail: "http://southparkstudios.mtvnimages.com/shared/characters/kids/kyle-schwartz.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "back",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("<:imback:452191400268922900> <@" + message.author.id + ">" + " is baaaaaaack!");
    }
});

module.exports = back;
