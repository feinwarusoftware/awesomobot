"use strict";

const Command = require("../command");

const bigboiiembeds = require("./libs/bigboiiembeds");

const rawrxd = new Command("dragon", "gay", "search lgbtq in google", "js", 0, null, (client, message, guildDoc) => {

    message.reply(bigboiiembeds.makethatembedboii("youre a gay boii"));
});

module.exports = rawrxd;
