"use strict"

const Command = require ("../command");

const welcome = new Command("welcome", "welcome to the server message", "js", 0, "welcome", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send("", {
        file: "https://cdn.discordapp.com/attachments/430447280932388865/452883193431982082/Welcome.png"
    });
});

//module.exports = welcome;