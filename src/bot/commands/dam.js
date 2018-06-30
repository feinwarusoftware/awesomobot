"use strict"

const Command = require("../command");

const dam = new Command("dam", "i broke the dam", "js", 0, "I broke the dam", "startswith", 0, false, null, function(client, message, guildDoc) {
    
    message.reply("No, I broke the dam");
        
});

module.exports = dam;