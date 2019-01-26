"use strict";

const discord = require("discord.js");

const Command = require("../script");

let towelinfo = new Command({

  name: "Towelie Info",
  description: "Read all about the best South Park character here!",
  help: "**[prefix]toweli** to see a bio on Towelie! *Now updated for Season 22!*",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092516969316362/t19.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "toweli",

  featured: false,

  preload: true,

  cb: function(client, message) {

    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setAuthor("AWESOM-O // About Towelie, https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png").setDescription("**Name: **Towelie\n**Age:** 17 *(Towel Years)*\n**Birthday:** May 8th 1980\n**Country:** USA\n**Occupations:** Budtender, Author, Waiter, Agricultural Inspector, Tegridy Farms Farmer, Tegridy Salestowel *(Current)*\n**Favourite Hobbies:** Getting high.\n\nHey there! I'm Towelie! I'm a smart towel developed at Tynacorp. I was designed to allow specific dryness depending on the situation. However, I have a small problem... I like to get high. One time, I was so broke I decided to get high on computer duster... Yeah it's fair to say I have a *slight* issue. On the bright side, I ended up going to rehab and I now provide for my wife, Rebecca, and my son, Washcloth, while also working as a budtender at the Medicinal Fried Chicken in South Park, Colorado.\n\n**Don't forget to bring a towel!**"));
  }
});

module.exports = towelinfo;
