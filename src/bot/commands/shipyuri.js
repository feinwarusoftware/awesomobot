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

let shipyuri = new Command({

    name: "South Park Ship Yuri",
    description: "Insert kinky description here",
    thumbnail: "https://img00.deviantart.net/b384/i/2006/139/4/2/who__s_kyle__by_luffy_kun.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "shipyuri",

    featured: false,

    cb: function (client, message, guildDoc) {

        const randomfemale1 = Math.floor(Math.random() * females.length);
        const randomfemale2 = Math.floor(Math.random() * females.length);
        message.channel.send("**:heart: Here's your ship:** " + females[randomfemale1] + " **x** " + females[randomfemale2] + " :heart:");
        if (females[randomfemale1] == females[randomfemale2]) {
            message.channel.send("**S E L F C E S T**");
        }
    }
});

module.exports = shipyuri;
