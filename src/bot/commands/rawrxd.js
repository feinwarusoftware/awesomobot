"use strict";

const Command = require("../command");

const bigboiiembeds = require("./libs/bigboiiembeds");

const rawrxd = new Command("dragon", "gay", "search lgbtq in google", "js", 0, "rawrxd", "command", null, (client, message, guildDoc) => {

    message.channel.send(bigboiiembeds.makethatembedboii("youre a gay boii"));
});

module.exports = rawrxd;
