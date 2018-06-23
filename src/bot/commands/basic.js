"use strict";

const Command = require("../command");

const basic = new Command("dragon1320", "basic", "basic command example for the new awesomo backend", "js" /* currently unused */, 0 /* currently unused */, "basic", "command", null, (client, message, guildDoc) => {

    message.reply("basic command example");
});

module.exports = basic;
