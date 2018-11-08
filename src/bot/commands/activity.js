"use strict"

const discord = require("discord.js");

const Command = require("../command");

const schemas = require("../../db");

const getLevelData = xp => {

    if (xp === 0) {

        return {

            level: 0,
            progress: 0
        };
    }

    const levels = [0, 1, 250, 400, 550, 700, 850, 1000, 1200, 1400, 1600, 1800, 2000, 2250, 2500, 2750, 3000, 3300, 3600, 4000, 4500];

    let count = 0;
    let level = 0;
    let progress = 0;

    for (let i = 0; i < levels.length; i++) {

        count += levels[i];

        if (xp < count) {

            level = i - 1;
            progress = 1 - (count - xp) / levels[i];
            break;
        }
    }

    if (level === 0 && count !== 0) {

        xp -= count;

        level = Math.floor(xp / 5000) + levels.length - 1;
        progress = (xp % 5000) / 5000;
    }

    if (level > 70) {

        level = 70;
        progress = 1;
    }

    return {

        level,
        progress
    };
}

const xp = new Command({
    
    name: "Activity Counter",
    description: "Get disappointed in life™",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099659738742787/activity.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "activeme;activeguild;activeglobal",

    featured: false,

    preload: true,

    cb: function(client, message, guild, user, script, match) {

        if (match === 0) {

            const memberIds = message.guild.members.array().map(m => m.user.id);

            schemas.UserSchema
                .aggregate([
                    {
                        $sort: {
                            xp: -1
                        }
                    },
                    {
                        $group: {
                            _id: {},
                            arr: {
                                $push: {
                                    discord_id: "$discord_id",
                                    xp: "$xp"
                                }
                            },
                            globalTotal: { $sum: 1 }
                        }
                    },
                    {
                        $unwind: {
                            path: "$arr",
                            includeArrayIndex: "globalRank"
                        }
                    },
                    {
                        $addFields: {
                            guild: {
                                $in: [ "$arr.discord_id", memberIds ]
                            }
                        }
                    },
                    {
                        $match: {
                            guild: true
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            arr: {
                                $push: {
                                    discord_id: "$arr.discord_id",
                                    globalRank: "$globalRank",
                                    globalTotal: "$globalTotal",
                                    xp: "$arr.xp"
                                }
                            },
                            guildTotal: { $sum: 1}
                        }
                    },
                    {
                        $unwind: {
                            path: "$arr",
                            includeArrayIndex: "guildRank"
                        }
                    },
                    {
                        $match: {
                            "arr.discord_id": message.author.id
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            discord_id: "$arr.discord_id",
                            xp: "$arr.xp",
                            globalRank: "$arr.globalRank",
                            globalTotal: "$arr.globalTotal",
                            guildRank: "$guildRank",
                            guildTotal: "$guildTotal"
                        }
                    }
                ])
                .then(users => {
                    if (users.length === 0) {

                        return message.reply("you have 0 xp (level 0)");
                    }

                    //console.log(users[0]);
                    message.reply(`Global Rank: **#${users[0].globalRank + 1}**/${users[0].globalTotal}, Guild Rank: **#${users[0].guildRank + 1}**/${users[0].guildTotal}, Score: **${users[0].xp}xp (level ${getLevelData(users[0].xp).level})**`);
                })
                .catch(error => {

                    message.reply(`error fetching xp teehee: ${error}`);
                });
        }
        if (match === 1) {

            const memberIds = message.guild.members.array().map(m => m.user.id);

            schemas.UserSchema
                .aggregate([
                    {
                        $sort: {
                            xp: -1
                        }
                    },
                    {
                        $group: {
                            _id: {},
                            arr: {
                                $push: {
                                    discord_id: "$discord_id",
                                    xp: "$xp"
                                }
                            },
                            globalTotal: { $sum: 1 }
                        }
                    },
                    {
                        $unwind: {
                            path: "$arr",
                            includeArrayIndex: "globalRank"
                        }
                    },
                    {
                        $addFields: {
                            guild: {
                                $in: [ "$arr.discord_id", memberIds ]
                            }
                        }
                    },
                    {
                        $match: {
                            guild: true
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            arr: {
                                $push: {
                                    discord_id: "$arr.discord_id",
                                    globalRank: "$globalRank",
                                    globalTotal: "$globalTotal",
                                    xp: "$arr.xp"
                                }
                            },
                            guildTotal: { $sum: 1}
                        }
                    },
                    {
                        $unwind: {
                            path: "$arr",
                            includeArrayIndex: "guildRank"
                        }
                    },
                    {
                        $limit: 5
                    },
                    {
                        $project: {
                            _id: 0,
                            discord_id: "$arr.discord_id",
                            xp: "$arr.xp",
                            globalRank: "$arr.globalRank",
                            globalTotal: "$arr.globalTotal",
                            guildRank: "$guildRank",
                            guildTotal: "$guildTotal"
                        }
                    }
                ])
                .then(users => {
                    if (users.length === 0) {

                        return message.reply("everyone has 0 xp");
                    }

                    const discordIds = users.map(u => u.discord_id);

                    const leaderboard = [];
                    for (let member of message.guild.members.array()) {

                        if (discordIds.includes(member.user.id)) {

                            leaderboard.push({
                                user: users.find(e => e.discord_id === member.user.id),
                                member,
                                guild
                            });
                        }
                    }

                    leaderboard.sort((a, b) => {
                        return b.user.xp - a.user.xp;
                    });

                    const embed = new discord.RichEmbed();
                    embed.setAuthor("AWESOM-O // Xp - Guild Top 5", "https://cdn.discordapp.com/avatars/379370506933108746/a979694bf250f2293d929278328b707c.png");
                    embed.setColor(0xff594f);

                    for (let [i, l] of leaderboard.entries()) {

                        if (l.user.xp === 0) {

                            continue;
                        }

                        embed.addField(`**#${i + 1}**/${l.user.guildTotal}`, `${l.member.user.username} - ${l.user.xp}xp (level ${getLevelData(l.user.xp).level}) ${"`"}(#${l.user.globalRank + 1}/${l.user.globalTotal} global)${"`"}`);
                    }

                    message.channel.send(embed);
                })
                .catch(error => {

                    message.reply(`error fetching xp teehee: ${error}`);
                });
        }
        if (match === 2) {

            const memberIds = message.guild.members.array().map(m => m.user.id);

            schemas.UserSchema
                .find()
                .sort({
                    xp: -1
                })
                .limit(5)
                .then(users => {

                    const discordIds = users.map(u => u.discord_id);
                    
                    const leaderboard = [];
                    for (let guild of client.guilds.array()) {
                        for (let member of guild.members.array()) {

                            if (discordIds.includes(member.user.id)) {

                                if (leaderboard.map(l => l.user.discord_id).includes(member.user.id) === true) {
                                    
                                    if (guild.id === message.guild.id) {

                                        let found = false;
                                        for (let i = 0; i < leaderboard.length; i++) {

                                            if (leaderboard[i].member.user.id === member.user.id) {

                                                found = true;

                                                leaderboard[i].member = member;
                                                leaderboard[i].guild = guild;

                                                break;
                                            }
                                        }

                                        if (found === false) {

                                            leaderboard.push({
                                                user: users.find(e => e.discord_id === member.user.id),
                                                member,
                                                guild
                                            });
                                        }
                                    } else {

                                        continue;
                                    }
                                } else {

                                    leaderboard.push({
                                        user: users.find(e => e.discord_id === member.user.id),
                                        member,
                                        guild
                                    });
                                }
                            }
                        }
                    }

                    leaderboard.sort((a, b) => {
                        return b.user.xp - a.user.xp;
                    });

                    const embed = new discord.RichEmbed();
                    embed.setAuthor("AWESOM-O // Xp - Global Top 5", "https://cdn.discordapp.com/avatars/379370506933108746/a979694bf250f2293d929278328b707c.png");
                    embed.setColor(0xff594f);

                    for (let [i, l] of leaderboard.entries()) {

                        embed.addField(`**#${i + 1}**`, `${l.member.user.username} - ${l.user.xp}xp (level ${getLevelData(l.user.xp).level}) ${l.guild.id === message.guild.id ? "" : `${"`"}(${l.guild.name})${"`"}`}`);
                    }

                    message.channel.send(embed);
                })
                .catch(error => {

                    message.reply(`could not get top 5 xp list: ${error}`);
                });
        }
    }
});

module.exports = xp;
