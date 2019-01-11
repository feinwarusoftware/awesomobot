"use strict";

const Command = require("../script");

const kickbaby = new Command({

  name: "Kick The Baby",
  description: "Don't kick the goddamn baby!",
  help: "Say **'Kick the baby!'** and AWESOM-O will respond!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092319681576990/t13.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "contains",
  match: "kick the baby",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    message.reply("Don't kick the goddamn baby!");
  }
});

module.exports = kickbaby;
