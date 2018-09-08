"use strict";

const Command = require("../command");

let spaces = new Command({

    name: "S P A C E S",
    description: "Add a little A E S T H E T I C to your text",
    thumbnail: "https://lh3.googleusercontent.com/UweWOGsYPwbP2QcK_3btS5UgrvwlZMRFvNnNyGdN5A2kicf7kzed0fT7rqX_oG3wDouDFsTVi3NmDxJo_xRJ8oAr0Ja1bv4gqH3o7w=s850",
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
