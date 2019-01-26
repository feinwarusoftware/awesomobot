"use strict";

const Command = require("../script");

const wink = new Command({

  name: "wink",
  description: "wonk",
  help: "**[prefix]wink** to recieve a nice wink from AWESOM-O!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092313314885632/t11.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "wink",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.reply("wonk");
  }
});

module.exports = wink;
