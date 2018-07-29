"use strict"

const discord = require("discord.js");

const Command = require("../command");

const infoe = new Command("infoe", "a command for getting info on emojis", "js", 0, "infoe", "command", 0, false, null, function (client, message, guildDoc) {

    let search = message.content.substring(guildDoc.prefix.length + this.match.length + 1);

    let detailFlag = false;
    if (search.indexOf("-d") !== -1) {

        search = search.replace("-d", "");

        detailFlag = true;
    }

    search = search.replace(/  +/, " ");
    search = search.trim();

    if (search === undefined || search.length === 0) {
        message.reply("you need to enter the thing to search for");
        return;
    }

    let emojis = message.guild.emojis.array();

    for (let i = 0; i < emojis.length; i++) {
        if (emojis[i].name === search) {

            // emoji found
            let embed = new discord.RichEmbed()
                .setColor(0xF0433A)
                .setAuthor(`AWESOM-O // Emoji Info`);

            embed.addField("Id:", "```" + emojis[i].id + "```");
            embed.addField("Name:", "```" + emojis[i].name + "```");
            embed.addField("Animated:", "```" + emojis[i].animated + "```");

            if (detailFlag === true) {

                embed.addField("Url:", "```" + emojis[i].url + "```");
                embed.addField("Identifier:", "```" + emojis[i].identifier + "```");
                embed.addField("RequiresColons:", "```" + emojis[i].requiresColons + "```");
                embed.addField("Managed:", "```" + emojis[i].managed + "```");
                embed.addField("CreatedBy:", "```" + emojis[i].client.user.username + "```");
                embed.addField("CreatedAt:", "```" + emojis[i].createdAt + "```");
            }

            message.channel.send(embed);

            return;
        }
    }
});

module.exports = infoe;