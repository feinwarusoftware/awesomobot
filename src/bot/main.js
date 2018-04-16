"use strict"

const discord = require("discord.js");
const client = require("./events");

const config = require("../../config");

function start() {

    // Load assets first before attempting to log in.
    client.loadAssets((err) => {
        if (err) {
            throw("Fatal error occured while trying to load assets!");
        }
        client.client.login(config.token);
    });
}

module.exports = {
    start,
    client
};
