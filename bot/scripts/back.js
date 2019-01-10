"use strict";

const Command = require("../script");

const back = new Command({

  name: "I'm Back!",
  description: "^^^",
  help: "**[prefix]back** to let everyone know you're baaaaack!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092309527298068/t10.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "back",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    message.channel.send("<:imback:452191400268922900> <@" + message.author.id + ">" + " is baaaaaaack!");
  }
});

module.exports = back;
