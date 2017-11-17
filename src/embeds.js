/**
 * embeds.js
 * Desc: Module for defining discord rich embeds.
 * Deps: None
 */

"use strict"

const discord = require("discord.js");

const config = require("./config/config-main");

const info = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor(config.name + ' // Info', 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail('http://screeninvasion.com/wp-content/uploads/2013/03/Butters-Awesom-O.jpg')
    .setTitle('Your all purpose South Park Bot!')
    .addField("-help for a list of commands", "If a command is missing, feel free to inform us")
    .addField("Crafted with love by Mattheous and Dragon1320. ♥", "Additional credit goes out to TowelRoyale for the amazing art")
    .setFooter("This bot is pretty schweet!");

const help1 = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor(config.name + ' // Commands', 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")
    .addField("ping", "Pong!")
    .addField("botinfo", "Displays a short description of the bot")
    .addField("help", "Type this if you want to cause inception")
    .addField("times", "Displays a list of times in different timezones.")
    .addField("ep {Episode Name}", "Displays info about the relevant episode")
    .setFooter("Page 1 of 2 :: Use -help2 to view page 2 (Non serious commands)");

const help2 = new discord.RichEmbed()
    .setColor(0xc19245)
    .setAuthor(config.name + ' // Commands', 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
    .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png");

function weresorry(cname) {
    const sorryEmbed = new discord.RichEmbed()
        .setColor(0x617)
        .setAuthor(config.name + " // ERROR INFO [ " + cname + " ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
        .addField("We're sorry", "What you just did doesn't seem to work. Either you're doing it wrong or we fucked up. If you think the command is broken, you can report it with -issue")
        .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

    return sorryEmbed;
}

module.exports = {
    info,
    help1,
    help2,
    weresorry,

};