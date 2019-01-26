"use strict";

const Command = require("../script");

const thinking = new Command({

  name: "🤔",
  description: "Things that make you go 🤔🤔🤔",
  help: "**[prefix]hmmm** to respond to a mind-boggling moment!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092395829297182/t30.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "hmmm",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.reply("Things that make you go 🤔🤔🤔");
  }
});

module.exports = thinking;
