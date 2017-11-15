"use strict"

const discord = require("discord.js");
const fs = require("fs");

const config = require("./src/config/config-main");
const cmd = require("./src/cmd");
const evnt = require("./src/evnt");
const embeds = require("./src/embeds");
const spnav = require("./src/spnav");

const client = new discord.Client();
client.login(config.token);

client.on("ready", () => {

    evnt.startup();

    client.user.setGame(config.version + " | -botinfo");

    // replace with flog
    console.log('Shweet! I am alive!');
});

client.on("message", function(message) {
    if (message.author.equals(client.user)) { return; }

    evnt.callcmd(message);
});