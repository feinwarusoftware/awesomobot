"use strict"

const discord = require("discord.js");

const Command = require("../command");

const harvest = new Command("harvest", "which celeb is up for it this year?", "js", 0, "harvest", "command", 0, false, null, function (client, message, guildDoc) {
    message.channel.send(new discord.RichEmbed()
        .setColor(0x8bc34a)
        .setAuthor("AWESOM-O // Harvest", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
        .setImage("https://www.billboard.com/files/styles/article_main_image/public/media/XXXTentacion-iheartradio-station-2017-billboard-1548.jpg")
        .setTitle("Jahseh Dwayne Ricardo Onfroy A.K.A XXXTentacion")
        .setDescription("Jaseh Dwayne Ricardo Onfroy *(A.K.A XXXTentacion)* was an American rapper, singer, songwriter and professional wife-beater.\n\nOnfroy was born in a Plantation in Florida on the 23rd of January 1998. From there, he made it big with his song “Look at Me”. This song was probably inspired by his treatment of his wife.\n\nOn June 18th 2018, Onfroy was shot in the neck and killed while leaving a motorcycle dealership in Deerfield Beach, Florida. He was pronounced dead at 5:30pm. May harvest be bountiful this year!")
        .setFooter("Ave, ave versus christus!")
        .setURL("https://youtu.be/6H3UiwU1N5I?t=3m2s"));
});

module.exports = harvest;