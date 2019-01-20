"use strict";

const Command = require("../script");

const welcome = new Command({

  name: "Feinwaru Welcome",
  description: "Welcome to the Feinwaru Server",
  help: "**[prefix]welcome** to welcome new members with a snazzy graphic!",
  thumbnail: "https://cdn.discordapp.com/attachments/430447280932388865/452883193431982082/Welcome.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "welcome",

  featured: false,

  preload: false,

  cb: function (client, message) {

    message.channel.send("", {
      file: "https://cdn.discordapp.com/attachments/430447280932388865/452883193431982082/Welcome.png"
    });
  }
});

module.exports = welcome;
