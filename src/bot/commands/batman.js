"use strict"

const Command = require("../command");

const batman = new Command("batman", "summons a brave dark knight", "js", 0, "batman", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send("", {
        file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
    });
});

//module.exports = batman;

