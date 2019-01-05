"use strict";

const discord = require("discord.js");

const Command = require("../script");
const { api: { LastFM } } = require("../../utils");

const config = require("../config.json");

const lastfm = new LastFM(config.fm_key);

const fm = new Command({

  name: "last.fm",
  description: "Check your last.fm stats",
  help: "```\n[prefix]fm <username> <selection> <time>```\n\n*Replace items in brackets with:*\n\n**username:** Your last.fm username (Required!)\n\n**selection:** recent/artists/albums/music/tracks (Optional)\n\n**time:** all/week/month (Optional)\n\n*Recent does not require a time*\n*(Must have a last.fm account.)*",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092391467352065/t29.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "fm",

  featured: false,

  preload: true,

  cb: function (client, message, guildDoc) {

    const args = message.content.split(" ");
    if (args[1] === undefined) {
      message.reply("youre missing the username to look up");
      return;
    }
    if (args[2] === undefined && args[3] === undefined) {
      args[2] = "recent";
      args[3] = null;
    } else {
      if (args[2] === undefined) {
        message.reply("youre missing either 'artists', 'albums', or 'tracks'");
        return;
      }
      if (args[3] === undefined) {
        message.reply("youre missing the time frame to look up, either 'week', 'month', or 'all'");
        return;
      }
    }

    let method;

    switch (args[2]) {
    case "recent":
      method = "user.getrecenttracks";
      break;
    case "artists":
      method = "user.gettopartists";
      break;
    case "albums":
      method = "user.gettopalbums";
      break;
    case "tracks":
      method = "user.gettoptracks";
      break;
    default:
      message.reply(`'${args[2]}' is not a valid argument, choose either 'artists', 'albums', or 'tracks'`);
      break;
    }

    let period;

    switch (args[3]) {
    case null:
      period = null;
      break;
    case "all":
      period = "overall";
      break;
    case "month":
      period = "1month";
      break;
    case "week":
      period = "7day";
      break;
    default:
      message.reply(`'${args[3]}' is not a valid argument, choose either 'week', 'month', or 'all'`);
      break;
    }

    let options = {};
    options.user = args[1];
    options.method = method;
    options.limit = 5;
    if (period !== null) {
      options.period = period;
    }


    lastfm.makeApiRequest(options).then(response => {

      if (response.data.error !== undefined) {
        message.reply("error making lastfm api request, check if you entered the user correctly");
        return;
      }

      let topFieldName;
      if (args[2] === "recent") {
        topFieldName = "recenttracks";
      } else {
        topFieldName = `top${args[2]}`;
      }

      let scopeName;
      if (args[3] === null) {
        scopeName = "track";
      } else {
        scopeName = args[2].substring(0, args[2].length - 1);
      }

      let embed = new discord.RichEmbed()
        .setColor(0xff594f)
        .setAuthor("AWESOM-O // Last.fm", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png")
        .setThumbnail(response.data[topFieldName][scopeName][0].image[response.data[topFieldName][scopeName][0].image.length - 1]["#text"])
        .setTitle(`last.fm ${args[2] === "recent" ? "" : "top"} ${args[3] === null ? "" : args[3]} ${args[2]}`)
        .setFooter("View full stats on last.fm")
        .setURL(`https://last.fm/user/${args[1]}`);

      for (let i = 0; i < response.data[topFieldName][scopeName].length; i++) {
        embed.addField(response.data[topFieldName][scopeName][i].name, `${response.data[topFieldName][scopeName][i].playcount === undefined ? response.data[topFieldName][scopeName][i].artist["#text"] : response.data[topFieldName][scopeName][i].playcount + " plays"}`);
      }

      message.channel.send(embed);
    }).catch(error => {
      message.reply("error making lastfm api request");
    });
  }
});

module.exports = fm;
