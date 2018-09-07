"use strict";

const Command = require("../command");

let spaces = new Command("spaces", "a e s t h e t i c", "js", 0, "spaces", "command", 0, false, null, function(client, message, guildDoc){
    let text = message.content.substring(this.match.length + guildDoc.prefix.length);
        let modified = ""

        for (let i = 0; i < text.length; i++) {
            if (text[i] == "~" || text[i] == "*") {
                modified = modified + text[i];
            } else {
                modified = modified + text[i] + " "
            }
        }
        message.channel.send(modified)
});

//module.exports = spaces;


