"use strict";

const discord = require("discord.js");

const Command = require("../script");

const rr = new Command({

  name: "Russian Roulette",
  description: "1 out of 6 chance of going bye bye",
  help: "**[prefix]rr** to have a 1/6 chance of going oof.",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092376858591263/t25.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "rr",

  featured: false,

  preload: true,

  cb: function(client, message) {

    let random = Math.random();
    console.log(random);
    if (random >= 0.83) {
      message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("*pulls trigger*\n\n**BANG!**\n\nUnlucky... You died...").setThumbnail("https://cdn.discordapp.com/attachments/452632364238110721/458361435639119893/skull_PNG72.png"));
    } else {
      message.channel.send(new discord.RichEmbed().setColor(0X7289DA).setDescription("*pulls trigger*\n\n***click***\n\nYou lived! Congratulations!").setThumbnail("https://cdn.discordapp.com/attachments/452632364238110721/458361437832871947/Green-Tick-PNG-Picture.png"));
    }
  }
});

module.exports = rr;
