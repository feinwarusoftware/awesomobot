"use strict"

const Command = require("../command");

const thinking = new Command({

    name: "🤔",
    description: "Things that make you go 🤔🤔🤔",
    thumbnail: "https://i.kym-cdn.com/entries/icons/original/000/022/488/c6bf9b08586c241b021dd04c204b7a85.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "hmmm",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("Things that make you go 🤔🤔🤔");
    }
});

module.exports = thinking;
