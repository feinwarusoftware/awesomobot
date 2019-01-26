"use strict";

const discord = require("discord.js");
const momentTz = require("moment-timezone");

const Command = require("../script");

const times = new Command({

  name: "Timezones",
  description: "Get the current time in different timezones",
  help: "**[prefix]times** to get the current time around the world!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092414913511424/t2.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "times",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.channel.send(new discord.RichEmbed()
      .setColor(0xff594f)
      .setAuthor("AWESOM-O // Times", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png")
      .addField("Pacific Standard Time", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Central European Time", momentTz().tz("Europe/Berlin").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Central Standard Time", momentTz().tz("America/Monterrey").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Eastern European Time", momentTz().tz("Asia/Nicosia").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Eastern Standard Time", momentTz().tz("America/New_York").format("Do MMMM YYYY, HH:mm"), true)
      .addField("China Standard Time", momentTz().tz("Asia/Shanghai").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Greenwich Mean Time", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, HH:mm"), true)
      .addField("Australian Eastern Time", momentTz().tz("Australia/Sydney").format("Do MMMM YYYY, HH:mm"), true)
      .setThumbnail("https://cdn.discordapp.com/attachments/379432139856412682/401485874040143872/hmmwhatsthetime.png"));
  }
});

module.exports = times;
