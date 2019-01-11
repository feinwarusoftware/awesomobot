"use strict";

const discord = require("discord.js");

const Command = require("../script");
const schemas = require("../../db");

const info = new Command({

  name: "AWESOM-O Info",
  description: "Info about the bot and its developers",
  help: "**[prefix]info** to see epic info about our amazing developers and the bot itself!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509384571842723849/Untitled-1.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "info",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    const embed = new discord.RichEmbed();
    embed.setAuthor("AWESOM-O // Info", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png");
    embed.setThumbnail("https://cdn.discordapp.com/attachments/209040403918356481/509384571842723849/Untitled-1.png");
    embed.setDescription("AWESOM-O is a multi-purpose bot developed by Dragon, Matt and other members of the community. You can check out all of them here: https://awesomo.feinwaru.com/credits/\n\nFor more info, please visit our website: https://awesomo.feinwaru.com/");
    embed.setFooter("© 2017 - 2019 Copyright: Feinwaru Software");

    message.channel.send(embed);
  }
});

module.exports = info;
