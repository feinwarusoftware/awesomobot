"use strict";

const Command = require("../script");

const females = [
  "Wendy",
  "Bebe",
  "Red",
  "Nelly",
  "Nicole",
  "Heidi",
  "Annie",
  "Esther",
  "Monica",
  "Sally",
  "Allie",
  "Ashley",
  "Beth",
  "Emily",
  "Isla",
  "Jenny",
  "Jessie",
  "Kal",
  "Kelly Pinkerton",
  "Kelly Rutherford",
  "Lizzy",
  "Lola",
  "Meagan",
  "Millie",
  "Nancy"
];

let shipyuri = new Command({

  name: "South Park Ship Yuri",
  description: "Insert kinky description here",
  help: "**[prefix]shipyuri** to ship two random South Park girls together!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092373616263183/t24.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "shipyuri",

  featured: false,

  preload: true,

  cb: function (client, message) {

    const randomfemale1 = Math.floor(Math.random() * females.length);
    const randomfemale2 = Math.floor(Math.random() * females.length);
    message.channel.send("**:heart: Here's your ship:** " + females[randomfemale1] + " **x** " + females[randomfemale2] + " :heart:");
    if (females[randomfemale1] == females[randomfemale2]) {
      message.channel.send("**S E L F C E S T**");
    }
  }
});

module.exports = shipyuri;
