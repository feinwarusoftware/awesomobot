"use strict"

const discord = require("discord.js");

const Command = require("../command");

const fuckyou = new Command("fuckyou", "Fuck you", "js", 0, "fuckyou", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send(new discord.RichEmbed().setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg"));

});

module.exports = fuckyou;