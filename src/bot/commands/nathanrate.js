"use strict"

const Command = require("../command");

const discord = require("discord.js");

const nathanrate = new Command({

    name: "Nathan Rating™",
    description: "Get your rating from Nathan",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092388929667098/t28.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "nathanrate",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {

        const quotes = [
            "**0/10.** You're more retared than Mimsy AND more annoying than Jimmy...",
            "**1/10.** I'd rather go back to Lake Tardicaca than hang out with you...",
            "**2/10.** How do you feel about being the comic relief?",
            "**3/10.** *DUH BOSS! LOOK! THIS USER GOT A 3-* Shut up, Mimsy!",
            "**4/10.** I'm not sure what's worse... You, or the Tardicaca shark...",
            "**5/10.** I'm sure the ads would let you live...",
            "**6/10.** Yes counselor Steve, I like the fun user.",
            "**7/10.** Finally, another like-minded individual...",
            "**8/10.** I'm glad you hate Jimmy as much as I do!",
            "**9/10.** You'll be drowing in muff soon!",
            "**10/10.** You're a Downs Syndrome destroyer!"
        ];
        const random = Math.floor(Math.random() * quotes.length);
        message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription(quotes[random]));
    }
});

module.exports = nathanrate;
