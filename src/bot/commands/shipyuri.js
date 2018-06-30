"use strict";

const Command = require("../command");

const females = [
    "Wendy",
    "Bebe",
    "Red",
    "Nelly",
    "Nicole",
    "Heidi",
    "Annie",
    "Esther",
    "Monica",
    "Sally",
    "Allie",
    "Ashley",
    "Beth",
    "Emily",
    "Isla",
    "Jenny",
    "Jessie",
    "Kal",
    "Kelly Pinkerton",
    "Kelly Rutherford",
    "Lizzy",
    "Lola",
    "Meagan",
    "Millie",
    "Nancy",
];

let shipyuri = new Command("shipyuri", "use this fucking command", "js", 0, "shipyuri", "command", 0, false, null, function(client, message, guildDoc){
    const randomfemale1 = Math.floor(Math.random() * females.length);
        const randomfemale2 = Math.floor(Math.random() * females.length);
        message.channel.send("**:heart: Here's your ship:** " + females[randomfemale1] + " **x** " + females[randomfemale2] + " :heart:");
        if (females[randomfemale1] == females[randomfemale2]) {
            message.channel.send("**S E L F C E S T**");
        }
});

module.exports = shipyuri;