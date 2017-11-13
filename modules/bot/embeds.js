"use strict"

const discord = require("discord.js");

const info = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor(`AWESOME-O // Info`, 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail('http://screeninvasion.com/wp-content/uploads/2013/03/Butters-Awesom-O.jpg')
    .setTitle('Your all purpose South Park Bot!')
    .addField("-help for a list of commands", "If a command is missing, feel free to inform us")
    .addField("Crafted with love by Mattheous and Dragon1320. ♥", "Additional credit goes out to TowelRoyale for the amazing art")
    .setFooter("This bot is pretty schweet!")

const help1 = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor("AWESOME-O // Commands", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")
    .addField("ping", "Pong!")
    .addField("botinfo", "Displays a short description of the bot")
    .addField("help", "Type this if you want to cause inception")
    .addField("times", "Displays a list of times in different timezones.")
    .addField("ep {Episode Name}", "Displays info about the relevant episode")
    .setFooter("Page 1 of 2 :: Use -help2 to view page 2 (Non serious commands)")

const help2 = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor("AWESOME-O // Commands", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")

module.exports = {
    info,
    help1,
    help2,

};