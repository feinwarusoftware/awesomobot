"use strict"

const discord = require("discord.js");

const groupError = function(command, fields) {
    const base = new discord.RichEmbed()
    .setColor(0x617)
    .setAuthor("AWESOM-O // GROUP ERROR " + "[ " + command.getJson().name + " ]")
    .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

    for (var i = 0; i < fields.length; i++) {
        base.addField(fields[i].head, fields[i].desc);
    }

    return base;
}

module.exports = {
    groupError,
};