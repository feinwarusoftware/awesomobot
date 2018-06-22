"use strict";

const discord = require("discord.js");

const makethatembedboii = desc => {
    
    return new discord.RichEmbed().setDescription(desc);
}

module.exports = {

    makethatembedboii
};
