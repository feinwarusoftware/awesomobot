"use strict"

const discord = require('discord.js');

const commands = require("./commands");
const embeds = require("./embeds");
const config = require("../../config/bot");

const client = new discord.Client();
const token = config.token;
const version = config.version;

client.on('ready', () => {
    client.user.setGame(version + " | -botinfo");

    // replace with flog
    console.log('Shweet! I am alive!');
});

client.on("message", function (message) {
    if (message.author.equals(client.user)) { return; }

    
});

function runBot() {
    client.login(token);
}

module.exports = {
    runBot,

};