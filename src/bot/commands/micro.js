"use strict"

const Command = require("../command");

const micro = new Command({

    name: "Microagression",
    description: "DID I JUST HEAR SOMEONE USE A MICROAGRESSION? ARRRGHHH",
    thumbnail: "https://2static.fjcdn.com/pictures/Pc+principal+brah+just+out+of+curiosity+what+are+your_c20788_5720727.jpg",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "micro",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.channel.send("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    }
});

module.exports = micro;
