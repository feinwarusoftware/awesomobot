"use strict";

const Command = require("../script");
const discord = require("discord.js");
const avatar = new Command({

  name: "Discord Avatar",
  description: "Sends your current discord avatar in chat",
  help: "**[prefix]avatar** to see your own avatar in high quality! Add a user's Discord name to see their icon!\n\n*Example: [prefix]avatar TowelRoyale*",
  thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099662204993536/avatar.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "avatar",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    let scaledSize = 512;

    let subMessage = message.content.substring(message.content.split(" ")[0].length + 1);

    let search = message.guild.members.array();

    if (subMessage !== undefined) {
      for (let i = 0; i < search.length; i++) {
        if (search[i].displayName === subMessage) {
          let currentSize = parseInt(search[i].user.avatarURL.substring(search[i].user.avatarURL.indexOf("size=") + 5), 10);
          if (currentSize === undefined) {
            message.reply("so... the bot shit itself, blame dragon");
          }
          if (currentSize < scaledSize) {
            scaledSize = currentSize;
          }

          if (search[i].user.avatarURL.substring(0, search[i].user.avatarURL.indexOf("size=") + 5) + scaledSize === "http512"){
            let embed = new discord.RichEmbed().setColor(0xff594f).setImage(search[i].user.avatarURL + "?size=" + scaledSize);
            message.channel.send(embed);
          } else {
            let embed = new discord.RichEmbed().setColor(0xff594f).setImage(search[i].user.avatarURL.substring(0, search[i].user.avatarURL.indexOf("size=") + 5) + scaledSize);
            message.channel.send(embed);
          }
          return;
        }

      }
    }
    if (subMessage === "") {
      let currentSize = parseInt(message.author.avatarURL.substring(message.author.avatarURL.indexOf("size=") + 5), 10);
      if (currentSize === undefined) {
        message.reply("so... the bot shit itself, blame dragon");
      }
      if (currentSize < scaledSize) {
        scaledSize = currentSize;
      }

      if (message.author.avatarURL.substring(0, message.author.avatarURL.indexOf("size=") + 5) + scaledSize === "http512"){
        let embed = new discord.RichEmbed().setColor(0xff594f).setImage(message.author.avatarURL + "?size=" + scaledSize);
        message.channel.send(embed);
      } else {
        let embed = new discord.RichEmbed().setColor(0xff594f).setImage(message.author.avatarURL.substring(0, message.author.avatarURL.indexOf("size=") + 5) + scaledSize);
        message.channel.send(embed);
      }
      return;
    }
  }
});

module.exports = avatar;

