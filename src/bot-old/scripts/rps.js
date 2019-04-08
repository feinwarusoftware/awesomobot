"use strict";

const Command = require("../script");

const rps = new Command({

  name: "Rock, Paper, Scissors",
  description: "Mate, do I even have to explain...",
  help: "**[prefix]rps** to play rock, paper scissors with another member!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092360345485323/t21.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "rps",

  featured: false,

  preload: true,

  cb: function(client, message,) {

    const rand = Math.floor(Math.random() * 3);

    let rps;
    switch (rand) {
    case 0:
      rps = "Rock";
      break;
    case 1:
      rps = "Paper";
      break;
    case 2:
      rps = "Scissors";
      break;
    }
    message.reply(rps);
  }
});

module.exports = rps;
