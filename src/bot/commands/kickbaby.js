"use strict"

const Command = require("../command");

const kickbaby = new Command({

    name: "Kick The Baby",
    description: "Don't kick the goddamn baby!",
    thumbnail: "http://mblogthumb2.phinf.naver.net/20150526_93/ahn3607_1432648019260WAaMx_JPEG/hqdefault.jpg?type=w2",
    marketplace_enabled: true,

    type: "js",
    match_type: "contains",
    match: "kick the baby",

    featured: false,

    cb: function(client, message, guildDoc) {

        message.reply("Don't kick the goddamn baby!");
    }
});

module.exports = kickbaby;
