"use strict";

const Command = require("../command");

let someone = new Command("someone", "Fuck you, Discord.", "js", 0, "someone", "command", 0, false, null, function(client, message, guildDoc){
    const quotes = [
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

module.exports = someone;


