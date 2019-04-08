"use strict";

const Command = require("../script");

const batman = new Command({

  name: "Batman",
  description: "na na na na na na na na",
  help:"**[prefix]batman** to see a cool image of Batman! ;)",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092330213605376/t16.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "batman",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.channel.send("", {
      file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
    });
  }
});

module.exports = batman;
