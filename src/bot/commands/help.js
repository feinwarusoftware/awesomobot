"use strict"

const discord = require("discord.js");

const Command = require("../command");
const schemas = require("../../db");

const help = new Command({

    name: "AWESOM-O Help",
    description: "Lists all the commands enabled on the current server.",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509384571842723849/Untitled-1.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "help",

    featured: false,

    preload: false,

    cb: function(client, message, guildDoc) {

        schemas.ScriptSchema
            .find({ __id: { $in: guildDoc.scripts.map(e => e.object_id) } })
            .then(scripts => {

                if (scripts.length === 0) {

                    return message.channel.send("no scripts enabled in this server :(");
                }

                const embed = discord.RichEmbed();
                embed.setAuthor("AWESOM-O 3.0 // Help", "https://cdn.discordapp.com/attachments/209040403918356481/509385256760115210/favicon.png");
                embed.setDescription("index | name | description | usage\n\n");

                for (let [i, script] of scripts.entries()) {

                    embed.description += `${i}. ${script.name}: ${script.description} (${"`"}${guildDoc.prefix}${"`"})\n`;
                }

                message.channel.send(embed);
            })
            .catch(error => {

                message.channel.send(`error fetching scripts: ${error}`);
            })
    }
});

module.exports = help;
