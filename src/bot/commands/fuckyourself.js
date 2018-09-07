"use strict"

const discord = require("discord.js");

const Command = require("../command");

const fuckyourself = new Command("fuckyourself", "Go fuck yourself", "js", 0, "fuckyourself", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif"));

});

//module.exports = fuckyourself;

