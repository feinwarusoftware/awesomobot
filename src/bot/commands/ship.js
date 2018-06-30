"use strict";

const Command = require("../command");

const males = [
    "Garry",
    "Cartman",
    "Kyle",
    "Stan",
    "Kenny",
    "Butters",
    "Clyde",
    "Craig",
    "Tweek",
    "Token",
    "Jimmy",
    "Timmy",
    "Nathan",
    "Mimsy",
    "Dogpoo",
    "Towelie",
    "Bradley",
    "Bill",
    "Fosse",
    "Brimmy",
    "Damien",
    "Pip",
    "Gregory",
    "Christophe",
    "Kevin",
    "Scott Malkinson",
    "GS-401"
];
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

let ship = new Command("ship", "conformist", "js", 0, "ship", "command", 0, false, null, function(client, message, guildDoc){
    const randommale = Math.floor(Math.random() * males.length);
        const randomfemale = Math.floor(Math.random() * females.length);
        message.channel.send("**:heart: Here's your ship:** " + males[randommale] + " **x** " + females[randomfemale] + " :heart:");
});

module.exports = ship;