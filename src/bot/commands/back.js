"use strict"

const Command = require("../command");

const back = new Command({

    name: "I'm Back!",
    description: "^^^",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092309527298068/t10.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "back",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("<:imback:452191400268922900> <@" + message.author.id + ">" + " is baaaaaaack!");
    }
});

module.exports = back;
