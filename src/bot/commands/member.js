"use strict"

const Command = require("../command");

const member = new Command({

    name: "Member?",
    description: "Oooh I member!",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092384122863636/t27.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "startswith",
    match: "member",

    featured: false,

    cb: function (client, message, guildDoc) {

        const memberMessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
        message.reply(memberMessages[Math.floor(Math.random() * memberMessages.length)]);
    }
});

module.exports = member;