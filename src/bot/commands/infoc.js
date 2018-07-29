"use strict"

const discord = require("discord.js");

const Command = require("../command");

const infoc = new Command("infoc", "a command for getting info on channels", "js", 0, "infoc", "command", 0, false, null, function (client, message, guildDoc) {

    let channels = message.guild.channels.array();

    let search = message.content.substring(guildDoc.prefix.length + this.match.length + 1);

    let detailFlag = false;
    if (search.indexOf("-d") !== -1) {

        search = search.replace("-d", "");

        detailFlag = true;
    }

    for (let i = 0; i < channels.length; i++) {
        if (channels[i].name === search) {

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            // channel found
            let embed = new discord.RichEmbed()
                .setColor(0xF0433A)
                .setAuthor(`AWESOM-O // Channel Info`);

            embed.addField("Id:", "```" + channels[i].id + "```");
            embed.addField("Name:", "```" + channels[i].name + "```");
            embed.addField("Type:", "```" + channels[i].type + "```");

            if (detailFlag === true) {

                embed.addField("Position:", "```" + channels[i].position + "```");
                embed.addField("Deletable:", "```" + channels[i].deletable + "```");

                switch (channels[i].type) {
                    case "text":
                        embed.addField("Nsfw:", "```" + channels[i].nsfw + "```");
                        embed.addField("Topic:", "```" + (channels[i].topic.length > 50 ? channels[i].topic.substring(0, 50) + "..." : channels[i].topic) + "```");
                        break;
                    case "voice":
                        embed.addField("UserLimit:", "```" + channels[i].userLimit + "```");
                        embed.addField("Bitrate:", "```" + channels[i].bitrate + "```");
                        break;
                }

                embed.addField("Parent:", "```" + channels[i].parent + "```");
                embed.addField("ParentId:", "```" + channels[i].parentID + "```");

                embed.addField("CreatedBy:", "```" + channels[i].client.user.username + "```");
                embed.addField("CreatedAt:", "```" + channels[i].createdAt + "```");
            }
            message.channel.send(embed);

            return;
        }
    }
});

module.exports = infoc;