"use strict";

const Command = require("../command");

let someone = new Command("someone", "Fuck you, Discord.", "js", 0, "@someone", "startswith", 0, false, null, function(client, message, guildDoc){
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
});

//module.exports = someone;


