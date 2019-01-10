"use strict";

const discord = require("discord.js");

const Command = require("../script");

const colour = new Command({

  name: "Feinwaru Colour",
  description: "Learn your overlord's colour",
  help: "**[prefix]colour** to see your patented Feinwaru colour!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092439210983455/t8.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "colour",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("The Feinwaru colour is: **0xff594f**"));
  }
});

module.exports = colour;
