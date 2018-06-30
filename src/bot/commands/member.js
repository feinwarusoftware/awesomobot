"use strict"

const Command = require("../command");

const member = new Command("member", "summons the member berries", "js", 0, "member", "startswith", 0, false, null, function(client, message, guildDoc) {
 
    const memberMessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
            message.reply(memberMessages[Math.floor(Math.random() * memberMessages.length)]);
        
});

module.exports = member;