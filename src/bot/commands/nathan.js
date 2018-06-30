"use strict"

const Command = require("../command");

const discord = require("discord.js");

const nathan = new Command("nathan", "possible downs kid", "js", 0, "nathan", "command", 0, false, null, function(client, message, guildDoc) {
    const quotes = [
            "https://cdn.discordapp.com/attachments/452632364238110721/457884887404511236/nathan1.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884901207703553/nathan10.jpg",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884902856065024/nathan7.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884909936181251/nathan9.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884912108699649/nathan4.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884914759499776/nathan3.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884916533952512/nathan8.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884917963948042/nathan5.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884927342542879/nathan11.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884928592576513/nathan2.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457884938025304087/nathan6.gif",
            "https://cdn.discordapp.com/attachments/452632364238110721/457886800070049792/nathan12.jpg",
        ];
        const random = Math.floor(Math.random() * quotes.length);
        message.channel.send(new discord.RichEmbed().setAuthor("RG-400 Smart Towel // Nathan Moments!").setDescription("Various moments from Nathan... *and Mimsy...*").setImage(quotes[random]).setFooter("Don't forget to bring a towel!"));
});

module.exports = nathan;