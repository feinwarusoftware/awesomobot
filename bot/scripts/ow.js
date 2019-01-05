"use strict"

const discord = require("discord.js");

const Command = require("../script");
const {
    api: {
        Overwatch
    }
} = require("../../utils");

const overwatch = new Overwatch();

const ow = new Command({

    name: "Overwatch Stats",
    description: "Check your overwatch in-game stats. Eg: -ow Mattheous#21537",
    thumbnail: "https://cdn.discordapp.com/attachments/508629797421973504/529046413003325471/Mlll9kHm_400x400.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "ow",

    featured: true,

    preload: true,

    cb: function (client, message, guildDoc) {

        const args = message.content.split(" ");

        let name;
        let platform;

        if (args[1] === undefined){
            return message.reply("No name was specified")
        }
        
        name = args[1];

        if (args[2] === "xbox") {
            platform = "xbl"
        } else if (args[2] === "xbl") {
            platform = "xbl"
        } else if (args[2] === "ps4") {
            platform = "psn"
        } else if (args[2] === "ps") {
            platform = "psn"
        } else if (args[2] === "psn") {
            platform = "psn"
        } else {
            platform = "pc"
        }

        /*if (args[1] === undefined) {
            message.reply("You are missing a username. Eg. Mattheous#21537");
            return;
        }*/

        let username = name.replace("#", "-")

        overwatch.makeApiRequest(username, platform).then(response => {

            let owYay = JSON.parse(response);
            let comp;

            if (platform === "pc"){
                comp = owYay.eu.stats.competitive
            } else {
                comp = owYay.any.stats.competitive
            }

            let embed = new discord.RichEmbed()
                .setColor(0xf99e1a)
                .setAuthor("AWESOM-O // Overwatch", comp.overall_stats.tier_image === undefined ? comp.overall_stats.avatar : comp.overall_stats.tier_image)
                .setThumbnail(comp.overall_stats.avatar)
                .setTitle(`${comp.overall_stats.comprank === null ? "N/A" : comp.overall_stats.comprank} SR // ${comp.overall_stats.tier === null ? "Rank N/A" : comp.overall_stats.tier.slice(0, 1).toUpperCase() + comp.overall_stats.tier.slice(1, comp.overall_stats.tier.length)} // Endorsement Level ${comp.overall_stats.endorsement_level}`)
                .addField("Games Won", comp.game_stats.games_won, true)
                .addField("Games Lost", comp.game_stats.games_lost, true)
                .addField("Eliminations", comp.game_stats.eliminations, true)
                .addField("Deaths", comp.game_stats.deaths, true)
                .addField("Best Kill Streak", comp.game_stats.kill_streak_best, true)
                .addField("Most Damage", comp.game_stats.all_damage_done_most_in_game, true)
                .addField("Most Healing", comp.game_stats.healing_done_most_in_game, true)
                .addField("Most Damage Blocked", comp.game_stats.barrier_damage_done_most_in_game, true)

            message.channel.send(embed);
        }).catch(error => {
            message.reply("Error: Your profile may be set to private or you have not played any competitive yet");
        });
    }
});

module.exports = ow;