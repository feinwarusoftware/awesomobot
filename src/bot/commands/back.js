"use strict"

const Command = require("../command");

const back = new Command("back", "Im baaaaack", "js", 0, "back", "command", 0, false, null, function(client, message, guildDoc) {
 
    message.channel.send("<:imback:452191400268922900> <@" + message.author.id + ">" + " is baaaaaaack!");

});

//module.exports = back;