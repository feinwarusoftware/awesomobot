"use strict";

const Command = require("../script");

const dice = new Command({

  name: "Dice",
  description: "Not the vidya games company",
  help: "**[prefix]dice** to roll a virtual six-sided die!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092305849024534/t9.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "dice",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.reply(Math.floor(Math.random() * 6) + 1);
  }
});

module.exports = dice;
