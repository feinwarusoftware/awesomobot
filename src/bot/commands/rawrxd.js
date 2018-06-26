"use strict";

const Command = require("../command");

const rawrxd = new Command("rawrxd", "rawrxd...", "js", 0, "r", "command", 0, true, null, (client, message, guildDoc) => {

    message.reply("rawrxd...");
});

module.exports = rawrxd;
