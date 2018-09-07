"use strict";

const discord = require("discord.js");

const Command = require("../command");

let reminder = new Command("reminder", "Towelie's important message!", "js", 0, "reminder", "command", 0, false, null, function(client, message, guildDoc){
    let random = Math.random();
        console.log(random);
        if (random >= 0.8) {
            message.channel.send("**DON'T TRUST THE GOVERNMENT!**");
        } else {
            message.channel.send("*Don't forget to bring a towel!*");
        }
});

//module.exports = reminder;