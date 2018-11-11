"use strict";

const Command = require("../script");

const discord = require("discord.js");

let towelrate = new Command({

    name: "Towel Rating™",
    description: "Anyone want rated? Anyone want rated by a towel!?",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092516969316362/t19.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "towelr",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {

        const quotes = [
            "**0/10.** You're an ultra trash towel.",
            "**1/10.** Not even a 6th grader would use you.",
            "**2/10.** You have some major holes to patch up.",
            "**3/10.** A wash cycle won't clean you.",
            "**4/10.** Maybe a trip to rehab would help.",
            "**5/10.** Average. You're not rough but not soft either.",
            "**6/10.** People won't forget you... Hopefully...",
            "**7/10.** You'll be walkin' on sunshine soon!",
            "**8/10.** Get high to reward yourself!",
            "**9/10.** You're super absorbent and soft!",
            "**10/10.** Tynacorp approved!",
        ];
        const random = Math.floor(Math.random() * quotes.length);
        message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription(quotes[random]).setFooter("Don't forget to bring a towel!"));
    }
});

module.exports = towelrate;
