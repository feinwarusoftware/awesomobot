"use strict";

const fs = require("fs");
const path = require("path");

const Command = require("../command");

const placeholder = fs.readFileSync(path.join(__dirname, "assets", "placeholder.txt")).toString();

const test = new Command("dragon", "oof", "big oof", "js", 0, { placeholder }, (client, message, guildDoc) => {

    message.reply(this.assets.placeholder);
});

module.exports = test;
