"use strict"

const discord = require("discord.js");
const client = require("./events");

function start() {
    client.login(process.env.BOT_TOKEN);
}

module.exports = start;