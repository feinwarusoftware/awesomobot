"use strict";

const Command = require("../script");

let someone = new Command({

  name: "@someone",
  description: "Can anybody find me!!!!??? Yeah this command basically copies that Discord April fools joke",
  help: "Say **'@someone'** to replicate Discord's 2018 April Fools joke!",
  thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/509103961819709440/unknown.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "startswith",
  match: "@someone",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    const quotes = [
      "ʢ⸌人⸍ʡ",
      "\\(・╭╮・)/",
      "\\(❍ᨓ❍)/",
      "乁(ᵔ ͜ʖᵔ)ㄏ",
      "└[ȍ‿ȍ]┘",
      "ᖗTωTᖘ",
      "ᕦ(♥ᨓ♥)ᕥ",
      "ᕦ(ᵔ ͜つᵔ)ᕥ",
      "⤜( ﾟ╭∩╮ ﾟ)⤏",
      "\\(• ʖ̯•)/",
      "(ง◥▶◞ ◀◤)ง",
      "(╯⩾▾⩽）╯︵ ┻━┻",
      "(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. o ･ ｡ﾟ",
      "ヽ༼ ಠ益ಠ ༽ﾉ",
      "¯\\_(ツ)_/¯",
      "(∩ ͡° ͜ʖ ͡°)⊃━✿✿✿✿✿✿",
      "(╭☞>﹏<)╭☞",
      "└[✧▾✧]┘",
      "ᕦT‿‿Tᕥ",
      "(づ$ロ$)づ",
      "(╯°□°）╯︵ ┻━┻"
    ];
    const random1 = Math.floor(Math.random() * quotes.length);
    let members = message.guild.members.array();
    let random2 = Math.floor(Math.random() * members.length);
    message.channel.send(quotes[random1] + " " + members[random2].user.username);
  }
});

module.exports = someone;
