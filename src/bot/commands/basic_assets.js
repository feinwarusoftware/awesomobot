"use strict";

const fs = require("fs");
const path = require("path");

const Command = require("../command");

const basic_assets = new Command("dragon1320", "basic_assets", "basic on-run asset loading command example for the new awesomo backend", "js" /* currently unused */, 0 /* currently unused */, "basic_assets", "command", null, (client, message, guildDoc) => {

    const contents = fs.readFileSync(path.join(__dirname, "assets", "basic.txt")).toString();

    message.reply(contents);
});

module.exports = basic_assets;
