"use strict";

const Command = require("../script");

const fuckyou = new Command({

  name: "Fuck You",
  description: "Can we copystrike Feinwaru?",
  help: "**[prefix]fuckyou** to show a funny image!",
  thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/487740197497470976/unknown.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "fuckyou",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.channel.send("", {
      file: "https://cdn.discordapp.com/attachments/379432139856412682/487740197497470976/unknown.png"
    });
  }
});

module.exports = fuckyou;
