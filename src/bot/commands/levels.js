"use strict"

const path = require("path");

const jimp = require("jimp");

const Command = require("../command");

const schemas = require("../../db");
const {
    textWidth,
    printCenter
} = require("./libs/jimp_print");

let fontLevel = null;
let fontPercent = null;
let fontRank = null;
let fontName = null;
let fontSection = null;

let infoCardBase = null;
let verifiedIcon = null;

const getLevelData = xp => {

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
        progress = 1 - (xp % 5000) / 5000;
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

const levels = new Command({

    name: "AWESOM-O Profiles",
    description: "*temp*",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "pf",

    featured: false,

    cb: function (client, message, guild, user, script, match) {

        let searchUser = message.author;

        const args = message.content.split(" ");
        if (args.length > 1) {

            args.shift();
        
            const username = args.join(" ");
            const member = message.guild.members.find(e => e.displayName.toLowerCase() === username.toLowerCase() || e.user.username.toLowerCase() === username.toLowerCase());
            if (member === null) {
    
                return message.reply(`user '${username}' does not exist in this guild`);
            }

            searchUser = member.user;
        }

        schemas.UserSchema
            .aggregate([{
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
                                banner: "$banner",
                                verified: "$verified",
                                xp: "$xp"
                            }
                        },
                        globalTotal: {
                            $sum: 1
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$arr",
                        includeArrayIndex: "globalRank"
                    }
                },
                {
                    $match: {
                        "arr.discord_id": searchUser.id
                    }
                },
                {
                    $project: {
                        _id: 0,
                        discord_id: "$arr.discord_id",
                        banner: "$arr.banner",
                        verified: "$arr.verified",
                        xp: "$arr.xp",
                        globalRank: "$globalRank",
                        globalTotal: "$globalTotal"
                    }
                }
            ])
            .then(async users => {
                if (users.length === 0) {

                    return message.reply("this user does not have a profile");
                }

                //const bg = await jimp.read(users[0].banner);
                //bg.resize(800, 750);

                const bg = new jimp(800, 750);
                bg.composite(infoCardBase, 0, 0);

                const levelData = getLevelData(users[0].xp);

                // 398 148 723 187
                const progress = new jimp(Math.floor(325 * levelData.progress), 39);
                progress.opaque();
                progress.color([
                    { apply: "red", params: [20] },
                    { apply: "green", params: [178] },
                    { apply: "blue", params: [82] }
                ]);

                bg.composite(progress, 398, 148);

                printCenter(bg, fontPercent, 161, 146, `${Math.floor(levelData.progress * 100)}%`, 800);
    
                // 16 19 296
                const avatar = await jimp.read(`https://cdn.discordapp.com/avatars/${searchUser.id}/${searchUser.avatar}.png?size=512`);
                avatar.resize(296, 296);
                bg.composite(avatar, 16, 19);
    
                printCenter(bg, fontLevel, 163, 35, `Level ${levelData.level}`, 800);
                printCenter(bg, fontRank, 165, 195, `#${users[0].globalRank + 1}/${users[0].globalTotal}`, 800);
                bg.print(fontName, 12, 316, searchUser.username);
    
                if (users[0].verified === true) {

                    bg.composite(verifiedIcon, textWidth(fontName, searchUser.username) - 5, 333);
                }

                bg.write(path.join(__dirname, "temp", "test.png"), () => {
    
                    message.channel.send("", {
                        file: path.join(__dirname, "temp", "test.png")
                    });
                }); 
            })
            .catch(error => {

                message.reply(`error fetching xp teehee: ${error}`);
            });
        },

        load: async function () {

            fontLevel = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontLevel.fnt"));
            fontPercent = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontPercent.fnt"));
            fontRank = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontRank.fnt"));
            fontName = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontName.fnt"));
            fontSection = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontSection.fnt"));

            infoCardBase = await jimp.read(path.join(__dirname, "assets", "info_card_base.png"));
            verifiedIcon = await jimp.read(path.join(__dirname, "assets", "verified.png"));

            console.log("'levels' script assets loaded successfully");
        }
});

module.exports = levels;