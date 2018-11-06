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

let ship = new Command({

    name: "South Park Ship",
    description: "Ships two random characters together",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092370499895297/t23.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "ship",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        const randommale = Math.floor(Math.random() * males.length);
        const randomfemale = Math.floor(Math.random() * females.length);
        message.channel.send("**:heart: Here's your ship:** " + males[randommale] + " **x** " + females[randomfemale] + " :heart:");
    }
});

module.exports = ship;
