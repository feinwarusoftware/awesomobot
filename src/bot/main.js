"use strict"

const discord = require("discord.js");
const client = require("./events");

const config = require("../../config");

function start() {
    client.login(config.token);
}

module.exports = start;