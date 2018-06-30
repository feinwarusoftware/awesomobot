"use strict"

const Command = require("../command");

const micro = new Command("micro", "Microaggression! Hit 'em", "js", 0, "micro", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send("", {
        file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
    });
});

module.exports = micro;
