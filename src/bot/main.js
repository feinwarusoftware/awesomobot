"use strict"

const discord = require("discord.js");
const client = require("./events");

function start() {
    client.login(process.env.AWESOMOBETA_TOKEN);
}

module.exports = start;