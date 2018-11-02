"use strict"

const Command = require("../command");

const member = new Command({

    name: "Member?",
    description: "Oooh I member!",
    thumbnail: "http://southparkstudios.mtvnimages.com/shared/characters/non-human/non-human-local-creatures-member-berries.png",
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