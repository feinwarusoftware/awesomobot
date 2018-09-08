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

let shipyaoi = new Command({

    name: "South Park Ship Yaoi",
    description: "Insert kinky af description here",
    thumbnail: "https://i.kym-cdn.com/entries/icons/original/000/019/185/12193298_10153252812762005_2540048115057789369_n.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "shipyaoi",

    featured: false,

    cb: function(client, message, guildDoc) {

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
    }
});

module.exports = shipyaoi;
