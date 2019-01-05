"use strict";

const discord = require("discord.js");

const Command = require("../script");

const harvest = new Command({

  name: "Harvest",
  description: "Ave, ave versus christus!",
  help: "**[prefix]harvest** to see the next harvest celebrity! May harvest be bountiful this year!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092437180809242/t7.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "harvest",

  featured: false,

  preload: true,

  cb: function (client, message, guildDoc) {

    message.channel.send(new discord.RichEmbed()
      .setColor(0xff594f)
      .setAuthor("AWESOM-O // Harvest", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png")
      .setImage("https://www.billboard.com/files/styles/article_main_image/public/media/XXXTentacion-iheartradio-station-2017-billboard-1548.jpg")
      .setTitle("Jahseh Dwayne Ricardo Onfroy A.K.A XXXTentacion")
      .setDescription("Jaseh Dwayne Ricardo Onfroy *(A.K.A XXXTentacion)* was an American rapper, singer, songwriter and professional wife-beater.\n\nOnfroy was born in a Plantation in Florida on the 23rd of January 1998. From there, he made it big with his song “Look at Me”. This song was probably inspired by his treatment of his wife.\n\nOn June 18th 2018, Onfroy was shot in the neck and killed while leaving a motorcycle dealership in Deerfield Beach, Florida. He was pronounced dead at 5:30pm. May harvest be bountiful this year!")
      .setFooter("Ave, ave versus christus!")
      .setURL("https://youtu.be/6H3UiwU1N5I?t=3m2s"));
  }
});

module.exports = harvest;