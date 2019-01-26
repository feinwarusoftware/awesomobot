"use strict";

const Command = require("../script");

const micro = new Command({

  name: "Microagression",
  description: "DID I JUST HEAR SOMEONE USE A MICROAGRESSION? ARRRGHHH",
  help:"**[prefix]micro** to alert someone to their horrendous microagression!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092428486279169/t5.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "micro",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.channel.send("", {
      file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
    });
  }
});

module.exports = micro;
