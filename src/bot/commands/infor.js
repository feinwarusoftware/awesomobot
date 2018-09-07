"use strict"

const discord = require("discord.js");

const Command = require("../command");

const infor = new Command("infor", "a command for getting info on roles", "js", 0, "infor", "command", 0, false, null, function (client, message, guildDoc) {

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

    let roles = message.guild.roles.array();
    
    // Avoid names breaking this by attempting to match ids first.
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === search) {

            // role found
            let embed = new discord.RichEmbed()
                .setColor(0xff594f)
                .setAuthor(`AWESOM-O // Role Info`);

            embed.addField("Id:", "```" + roles[i].id + "```");
            embed.addField("Name:", "```" + roles[i].name + "```");
            embed.addField("Color:", "```" + roles[i].hexColor + "```");

            if (detailFlag === true) {

                embed.addField("Position:", "```" + roles[i].position + "```");
                embed.addField("Mentionable:", "```" + roles[i].mentionable + "```");
                embed.addField("Hoist:", "```" + roles[i].hoist + "```");
                embed.addField("Editable:", "```" + roles[i].editable + "```");
                embed.addField("Managed:", "```" + roles[i].managed + "```");
                embed.addField("CreatedBy:", "```" + roles[i].client.user.username + "```");
                embed.addField("CreatedAt:", "```" + roles[i].createdAt + "```");
            }

            message.channel.send(embed);

            return;
        }
    }
});

//module.exports = infor;