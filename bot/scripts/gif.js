"use strict";

const discord = require("discord.js");

const Command = require("../script");

const gif = new Command({

  name: "South Park Gifs",
  description: "Choose from a cheeky selection of jifs. https://github.com/feinwarusoftware/awesomobot/wiki/Available-Gifs",
  help: "**[prefix]gif** to play a random South Park GIF!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/403242738428149770/buttersdancegif.gif",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "gif",

  featured: false,

  preload: true,

  cb: function (client, message, guildDoc) {

    const map = ["vchip", "buttersgun", "buttersdance", "kennydance", "meeem", "cartmandance", "slap", "zimmerman", "nice", "triggered", "cartmansmile", "stanninja", "kylethinking", "ninjastar", "cartmaninvisible", "stanpuking", "kylegiant", "iketrumpet"];

    const gifs = {
      vchip: "https://cdn.discordapp.com/attachments/209040403918356481/403242859798462485/vchipgif.gif",
      buttersgun: "https://cdn.discordapp.com/attachments/209040403918356481/403242745436831745/buttersgunguf.gif",
      buttersdance: "https://cdn.discordapp.com/attachments/209040403918356481/403242738428149770/buttersdancegif.gif",
      kennydance: "https://cdn.discordapp.com/attachments/209040403918356481/403242745608798218/kennydancegif.gif",
      meeem: "https://cdn.discordapp.com/attachments/209040403918356481/403242745176522754/meeemgif.gif",
      cartmandance: "https://cdn.discordapp.com/attachments/209040403918356481/403242753695154205/cartmandagif.gif",
      slap: "https://cdn.discordapp.com/attachments/209040403918356481/403242745734365184/slapgif.gif",
      zimmerman: "https://cdn.discordapp.com/attachments/209040403918356481/403242825199779840/zimmermangif.gif",
      nice: "https://cdn.discordapp.com/attachments/209040403918356481/403242751375966208/nicegif.gif",
      triggered: "https://cdn.discordapp.com/attachments/209040403918356481/403242747076542484/triggeredgif.gif",
      cartmansmile: "https://cdn.discordapp.com/attachments/379432139856412682/403236890003767308/3e327295ae5518d4dd6076a99891f2631bc0ebdf_128.gif",
      stanninja: "https://cdn.discordapp.com/attachments/379432139856412682/403236890947485696/fbe592f6de0304252ed1e330c5eec60a5ff4b7ef_128.gif",
      kylethinking: "https://cdn.discordapp.com/attachments/379432139856412682/403236896026656769/dce7da75fa93d5a56eb5d6b4b670efd20ba26c2f_128.gif",
      ninjastar: "https://cdn.discordapp.com/attachments/209040403918356481/403242875229306881/ninjastargif.gif",
      cartmaninvisible: "https://cdn.discordapp.com/attachments/209040403918356481/403242747399634964/cartmaninvisiblegif.gif",
      stanpuking: "https://cdn.discordapp.com/attachments/209040403918356481/403242748897132547/stanpukinggif.gif",
      kylegiant: "https://cdn.discordapp.com/attachments/379432139856412682/404397468030205952/kylegiant.gif",
      iketrumpet: "https://cdn.discordapp.com/attachments/379432139856412682/404397432881938448/iketrumpets.gif"
    };

    const args = message.content.split(" ");

    if (!args[1] || !gifs[args[1]]) {
      let embed = new discord.RichEmbed().setColor(0xff594f).setImage(gifs[map[Math.floor(Math.random() * map.length)]]);
      message.channel.send(embed);
      return;
    }

    let embed = new discord.RichEmbed().setColor(0xff594f).setImage(gifs[args[1]]);
    message.channel.send(embed);
  }
});

module.exports = gif;