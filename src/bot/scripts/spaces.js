"use strict";

const Command = require("../script");

let spaces = new Command({

  name: "S P A C E S",
  description: "Add a little A E S T H E T I C to your text",
  help: "**[prefix]spaces <text>** to add a bit more room to your message!\n\nEg. [prefix]spaces fat = f a t",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092409569837066/t1.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "spaces",

  featured: false,

  preload: true,

  cb: function (client, message, guildDoc) {

    let text = message.content
      .substring(this.match.length + guildDoc.prefix.length);
    let modified = "";

    for (let i = 0; i < text.length; i++) {
      if (text[i] == "~" || text[i] == "*") {
        modified = modified + text[i];
      } else {
        modified = modified + text[i] + " ";
      }
    }
    message.channel.send(modified);
  }
});

module.exports = spaces;
