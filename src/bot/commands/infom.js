"use strict"

const discord = require("discord.js");

const Command = require("../command");

const infom = new Command("infom", "a command for getting info on members", "js", 0, "infom", "command", 0, false, null, function (client, message, guildDoc) {
   
    let members = message.guild.members.array();

    let search = message.content.substring(guildDoc.prefix.length + this.match.length + 1);

    let detailFlag = false;
    if (search.indexOf("-d") !== -1) {

        search = search.replace("-d", "");

        detailFlag = true;
    }

    for (let i = 0; i < members.length; i++) {
        if (members[i].displayName === search) {

            // user found
            let embed = new discord.RichEmbed()
                .setColor(0xff594f)
                .setAuthor(`AWESOM-O // Member Info`);

            embed.addField("Id:", "```" + members[i].user.id + "```");
            embed.addField("Name:", "```" + members[i].user.username + "```");
            embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

            if (detailFlag === true) {

                embed.addField("Kickable:", "```" + members[i].kickable + "```");
                embed.addField("Bannable:", "```" + members[i].bannable + "```");
                embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
            }

            message.channel.send(embed);

            return;
        }
    }
});

module.exports = infom;