"use strict"

const fs = require("fs");
const path = require("path");

const jimp = require("jimp");

const Command = require("../command");

const schemas = require("../../db");
const {
    getTextHeight,
    textWidth,
    printCenter
} = require("./libs/jimp_print");

let fontLevel = null;
let fontPercent = null;
let fontRank = null;
let fontName = null;
let fontSection = null;
let fontAbout = null;

let infoCardBase = null;
let verifiedIcon = null;

const trophies = [];

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

const levels = new Command({

    name: "AWESOM-O Profiles",
    description: "Allows you show the world your AWESOM-O profile with one short and sweet command",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099658036117530/profile.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "pf",

    featured: false,

    preload: true,

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
                                bio: "$bio",
                                trophies: "$trophies",
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
                        bio: "$arr.bio",
                        trophies: "$arr.trophies",
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

                const bg = new jimp(800, 750);

                const banner = await jimp.read(users[0].banner);

                const prop = banner.bitmap.width / banner.bitmap.height;
                if (prop >= 1) {

                    // change height
                    const heightDiff = bg.bitmap.height - banner.bitmap.height;
                    banner.resize((banner.bitmap.height + heightDiff) * prop, banner.bitmap.height + heightDiff);

                    banner.crop((banner.bitmap.width / 2) - bg.bitmap.width / 2, 0, bg.bitmap.width, bg.bitmap.height);
                    banner.blur(2);

                    bg.composite(banner, 0, 0);
                } else {

                    // change width
                    const diffWidth = bg.bitmap.width - banner.bitmap.width;
                    banner.resize(banner.bitmap.width + diffWidth, (banner.bitmap.width + diffWidth) / prop);

                    banner.crop(0, (banner.bitmap.height / 2) - bg.bitmap.height / 2, bg.bitmap.width, bg.bitmap.height);
                    banner.blur(2);

                    bg.composite(banner, 0, 0);
                }

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

                // 24,472 || 360x254
                let changed = false;
                let modifiedAbout = users[0].bio;

                //const testHeight = getTextHeight(fontAbout, changed === true ? `${modifiedAbout}...` : modifiedAbout, 360);

                while (getTextHeight(fontAbout, changed === true ? `${modifiedAbout}...` : modifiedAbout, 360) > 150) {

                    const modifedArray = modifiedAbout.split(" ");
                    modifedArray.pop();
                    modifiedAbout = modifedArray.join(" ");

                    changed = true;
                }

                bg.print(fontAbout, 24, 472, changed === true ? `${modifiedAbout}...` : modifiedAbout, 360);

                // trophies
                const userTrophies = [];
                for (let i = 0; i < trophies.length; i++) {

                    const trophy = users[0].trophies.find(e => e === trophies[i].dbName);
                    if (trophy !== undefined) {

                        userTrophies.push(trophies[i]);
                    }
                }

                userTrophies.sort((a, b) => {

                    return a.importance - b.importance;
                });

                userTrophies.splice(8, Math.max(0, userTrophies.length - 8));

                const trophySize = 90;

                for (let i = 0; i < userTrophies.length; i++) {

                    let xoffset = (i % 4) * trophySize;
                    let yoffset = (i > 3 ? 1 : 0) * trophySize;

                    userTrophies[i].image.color([
                        { apply: "mix", params: [userTrophies[i].colour, 100] }
                    ]);

                    bg.composite(userTrophies[i].image, 416 + xoffset, 472 + yoffset);
                }
                
                // save + post
                const saveDate = Date.now();

                bg.write(path.join(__dirname, "temp", `pf-${saveDate}.png`), async () => {
    
                    await message.channel.send("", {
                        file: path.join(__dirname, "temp", `pf-${saveDate}.png`)
                    })

                    fs.unlink(path.join(__dirname, "temp", `pf-${saveDate}.png`), error => {
                        if (error !== null && error !== undefined) {

                            throw `could not delete: pf-${saveDate}.png`;
                        }
                    });
                });
            })
            .catch(error => {

                message.reply(`error sending profile: ${error}`);
            });
        },

        load: function () {
            return new Promise(async (resolve, reject) => {

                fontLevel = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontLevel.fnt"));
                fontPercent = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontPercent.fnt"));
                fontRank = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontRank.fnt"));
                fontName = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontName.fnt"));
                fontSection = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontSection.fnt"));
                fontAbout = await jimp.loadFont(path.join(__dirname, "assets", "fonts", "fontAbout.fnt"));
    
                infoCardBase = await jimp.read(path.join(__dirname, "assets", "info_card_base.png"));
                verifiedIcon = await jimp.read(path.join(__dirname, "assets", "verified.png"));

                const trophy1 = await jimp.read(path.join(__dirname, "assets", "trophy-1.0.png"));
                const trophy2 = await jimp.read(path.join(__dirname, "assets", "trophy-2.0.png"));
                const trophyArt = await jimp.read(path.join(__dirname, "assets", "trophy-art.png"));
                const trophyBot = await jimp.read(path.join(__dirname, "assets", "trophy-bot.png"));
                const trophyChinpokomon = await jimp.read(path.join(__dirname, "assets", "trophy-chinpokomon.png"));
                const trophyCode = await jimp.read(path.join(__dirname, "assets", "trophy-code.png"));
                const trophyCrayon = await jimp.read(path.join(__dirname, "assets", "trophy-crayon.png"));
                const trophyFs = await jimp.read(path.join(__dirname, "assets", "trophy-fs.png"));
                const trophyGroup = await jimp.read(path.join(__dirname, "assets", "trophy-group.png"));
                const trophyMod = await jimp.read(path.join(__dirname, "assets", "trophy-mod.png"));
                const trophyPatreon = await jimp.read(path.join(__dirname, "assets", "trophy-patreon.png"));
                const trophyTrans = await jimp.read(path.join(__dirname, "assets", "trophy-trans.png"));
                const trophyVerified = await jimp.read(path.join(__dirname, "assets", "trophy-verified.png"));

                trophies.push({
                    image: trophyFs,
                    colour: "#ff594f",
                    dbName: "feinwaru-dev",
                    importance: 0
                });
                
                trophies.push({
                    image: trophyMod,
                    colour: "#099b10",
                    dbName: "mod",
                    importance: 1
                });

                trophies.push({
                    image: trophyGroup,
                    colour: "#1cb891",
                    dbName: "partner",
                    importance: 2
                });

                trophies.push({
                    image: trophyBot,
                    colour: "#ff594f",
                    dbName: "bot",
                    importance: 3
                });

                trophies.push({
                    image: trophyPatreon,
                    colour: "#fb664e",
                    dbName: "patron-1",
                    importance: 4
                });

                trophies.push({
                    image: trophyPatreon,
                    colour: "#fb664e",
                    dbName: "patron-5",
                    importance: 5
                });

                trophies.push({
                    image: trophyPatreon,
                    colour: "#fb664e",
                    dbName: "patron-10",
                    importance: 6
                });

                trophies.push({
                    image: trophyTrans,
                    colour: "#1c65b8",
                    dbName: "translator",
                    importance: 7
                });

                trophies.push({
                    image: trophyArt,
                    colour: "#df3cb6",
                    dbName: "artist",
                    importance: 8
                });

                trophies.push({
                    image: trophyChinpokomon,
                    colour: "#d67f0e",
                    dbName: "uchinpokomon",
                    importance: 9
                });

                trophies.push({
                    image: trophyChinpokomon,
                    colour: "#fd9a19",
                    dbName: "rchinpokomon",
                    importance: 10
                });

                trophies.push({
                    image: trophyArt,
                    colour: "#fd9a19",
                    dbName: "ac18_1",
                    importance: 11
                });

                trophies.push({
                    image: trophyArt,
                    colour: "#838383",
                    dbName: "ac18_2",
                    importance: 12
                });

                trophies.push({
                    image: trophyArt,
                    colour: "#a55029",
                    dbName: "ac18_3",
                    importance: 13
                });

                trophies.push({
                    image: trophyArt,
                    colour: "#7289DA",
                    dbName: "ac18_ww",
                    importance: 14
                });

                trophies.push({
                    image: trophyCrayon,
                    colour: "#fd9a19",
                    dbName: "cc18_1",
                    importance: 15
                });

                trophies.push({
                    image: trophyCrayon,
                    colour: "#838383",
                    dbName: "cc18_2",
                    importance: 16
                });

                trophies.push({
                    image: trophyCrayon,
                    colour: "#a55029",
                    dbName: "cc18_3",
                    importance: 17
                });

                trophies.push({
                    image: trophyCrayon,
                    colour: "#7289DA",
                    dbName: "cc18ww",
                    importance: 18
                });

                trophies.push({
                    image: trophy1,
                    colour: "#4e9ffb",
                    dbName: "awesomo-1",
                    importance: 19
                });

                trophies.push({
                    image: trophy2,
                    colour: "#68358a",
                    dbName: "awesomo-2",
                    importance: 20
                });

                trophies.push({
                    image: trophyCode,
                    colour: "#222222",
                    dbName: "verified-script",
                    importance: 21
                });

                trophies.push({
                    image: trophyCode,
                    colour: "#222222",
                    dbName: "featured-script",
                    importance: 22
                });

                resolve();
            });
        }
});

module.exports = levels;
