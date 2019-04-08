"use strict";

const discord = require("discord.js");

const Command = require("../script");

const schemas = require("../../db");

const shits = new Command({

  name: "Shit Counter",
  description: "Get shit on!",
  help: "**[prefix]shitme** to see the total amount of times you said shit!\n\n**[prefix]shitguild** to see the most foul mouthed members in the server!\n\n**[prefix]shitfglobal** to see the most foul mouthed members in all AWESOM0O hosted servers!",
  thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099661869580298/shit.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "shitme;shitguild;shitglobal",

  featured: false,

  preload: true,

  cb: function(client, message, guild, user, script, match) {

    if (match === "shitme") {

      const memberIds = message.guild.members.array().map(m => m.user.id);

      schemas.UserSchema
        .aggregate([
          {
            $sort: {
              shits: -1
            }
          },
          {
            $group: {
              _id: {},
              arr: {
                $push: {
                  discord_id: "$discord_id",
                  shits: "$shits"
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
                  shits: "$arr.shits"
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
              shits: "$arr.shits",
              globalRank: "$arr.globalRank",
              globalTotal: "$arr.globalTotal",
              guildRank: "$guildRank",
              guildTotal: "$guildTotal"
            }
          }
        ])
        .then(users => {
          if (users.length === 0) {

            return message.reply("you have 0 shits");
          }

          //console.log(users[0]);
          message.reply(`Global Rank: **#${users[0].globalRank + 1}**/${users[0].globalTotal}, Guild Rank: **#${users[0].guildRank + 1}**/${users[0].guildTotal}, Score: **${users[0].shits} shits**`);
        })
        .catch(error => {

          message.reply(`error fetching shits teehee: ${error}`);
        });
    }
    if (match === "shitguild") {

      const memberIds = message.guild.members.array().map(m => m.user.id);

      schemas.UserSchema
        .aggregate([
          {
            $sort: {
              shits: -1
            }
          },
          {
            $group: {
              _id: {},
              arr: {
                $push: {
                  discord_id: "$discord_id",
                  shits: "$shits"
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
                  shits: "$arr.shits"
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
              shits: "$arr.shits",
              globalRank: "$arr.globalRank",
              globalTotal: "$arr.globalTotal",
              guildRank: "$guildRank",
              guildTotal: "$guildTotal"
            }
          }
        ])
        .then(users => {
          if (users.length === 0) {

            return message.reply("everyone has 0 shits");
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
            return b.user.shits - a.user.shits;
          });

          const embed = new discord.RichEmbed();
          embed.setAuthor("AWESOM-O // Shits - Guild Top 5", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png");
          embed.setColor(0xff594f);

          for (let [i, l] of leaderboard.entries()) {

            if (l.user.shits === 0) {

              continue;
            }

            embed.addField(`**#${i + 1}**/${l.user.guildTotal}`, `${l.member.user.username} - ${l.user.shits} ${"`"}(#${l.user.globalRank + 1}/${l.user.globalTotal} global)${"`"}`);
          }

          message.channel.send(embed);
        })
        .catch(error => {

          message.reply(`error fetching shits teehee: ${error}`);
        });
    }
    if (match === "shitglobal") {

      //const memberIds = message.guild.members.array().map(m => m.user.id);

      schemas.UserSchema
        .find()
        .sort({
          shits: -1
        })
        .limit(5)
        .then(users => {

          const discordIds = users.map(u => u.discord_id);

          const leaderboard = [];
          for (let guild of client.guilds.array()) {
            for (let member of guild.members.array()) {

              if (discordIds.includes(member.user.id)) {

                if (leaderboard
                  .map(l => l.user.discord_id)
                  .includes(member.user.id) === true) {

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
            return b.user.shits - a.user.shits;
          });

          const embed = new discord.RichEmbed();
          embed.setAuthor("AWESOM-O // Shits - Global Top 5", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png");
          embed.setColor(0xff594f);

          for (let [i, l] of leaderboard.entries()) {

            embed.addField(`**#${i + 1}**`, `${l.member.user.username} - ${l.user.shits} ${l.guild.id === message.guild.id ? "" : `${"`"}(${l.guild.name})${"`"}`}`);
          }

          message.channel.send(embed);
        })
        .catch(error => {

          message.reply(`could not get top 5 shit list: ${error}`);
        });
    }
  }
});

module.exports = shits;
