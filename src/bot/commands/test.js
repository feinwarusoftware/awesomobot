"use strict";

const Command = require("../command");

const test = new Command({

    name: "AWESOM-O Test",
    description: "Test that AWESOM-O isn't 🅱roke",
    thumbnail: undefined,
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "test",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("testing...");
    }
});

module.exports = test;
