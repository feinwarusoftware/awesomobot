"use strict";

const Command = require("../command");

let spaces = new Command({

    name: "S P A C E S",
    description: "Add a little A E S T H E T I C to your text",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092409569837066/t1.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "spaces",

    featured: false,

    cb: function (client, message, guildDoc) {

        let text = message.content.substring(this.match.length + guildDoc.prefix.length);
        let modified = ""

        for (let i = 0; i < text.length; i++) {
            if (text[i] == "~" || text[i] == "*") {
                modified = modified + text[i];
            } else {
                modified = modified + text[i] + " "
            }
        }
        message.channel.send(modified);
    }
});

module.exports = spaces;
