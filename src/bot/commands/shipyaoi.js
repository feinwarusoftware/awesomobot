"use strict";

const Command = require("../command");

const discord = require("discord.js");

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

let shipyaoi = new Command("shipyaoi", "gay", "js", 0, "shipyaoi", "command", 0, false, null, function(client, message, guildDoc){
    let gayMods = Math.random()
    if(gayMods > 0.95){
       message.channel.send(new discord.RichEmbed().setDescription(":heart: !Dragon1320 **x** TowelRoyale :heart:").setImage("https://cdn.discordapp.com/attachments/437671103536824340/462641129188229130/dragon_and_towel_being_gay_by_phinbella_flynn-dcflyqh.png.jpg")); 
       return;
    } 
    const randommale1 = Math.floor(Math.random() * males.length);
    const randommale2 = Math.floor(Math.random() * males.length);
    message.channel.send("**:heart: Here's your yaoi ship:** " + males[randommale1] + " **x** " + males[randommale2] + " :heart:");
    if (males[randommale1] == males[randommale2]) {
        message.channel.send("**S E L F C E S T**");
    }
});

//module.exports = shipyaoi;