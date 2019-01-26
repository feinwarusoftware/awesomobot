"use strict";

const Command = require("../script");

const discord = require("discord.js");

const nathan = new Command({

  name: "Nathan Moments",
  description: "Shut up Mimsy!!",
  help: "**[prefix]nathan** to see a random Nathan (and Mimsy) moment!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092388929667098/t28.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "nathan",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    const nathan = [
      "https://cdn.discordapp.com/attachments/452632364238110721/457884887404511236/nathan1.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884901207703553/nathan10.jpg",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884902856065024/nathan7.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884909936181251/nathan9.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884912108699649/nathan4.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884914759499776/nathan3.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884916533952512/nathan8.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884917963948042/nathan5.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884927342542879/nathan11.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884928592576513/nathan2.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457884938025304087/nathan6.gif",
      "https://cdn.discordapp.com/attachments/452632364238110721/457886800070049792/nathan12.jpg"
    ];
    const random = Math.floor(Math.random() * nathan.length);
    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setAuthor("AWESOM-O // Nathan Moments!", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png").setDescription("Various moments from Nathan... *and Mimsy...*").setImage(nathan[random]));
  }
});

module.exports = nathan;
