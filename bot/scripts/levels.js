"use strict"

const fs = require("fs");
const path = require("path");

//const { performance } = require("perf_hooks");

//const jimp = require("jimp");

const sharp = require("sharp");
const rp = require("request-promise-native");

const Command = require("../script");

const schemas = require("../../db");
const {
    jimp: {
        magicRecolour,
        colourPrint,
        plainText,
    },
    getTextHeight,
    textWidth,
    printCenter,
    getLevelData,
    hexToRgb
} = require("../../utils");

let infoCardBase = null;

const trophies = [];

const cache = [];

const robotoMediumWidths = {
    "0": 15,
    "1": 15,
    "2": 15,
    "3": 15,
    "4": 15,
    "5": 15,
    "6": 15,
    "7": 15,
    "8": 15,
    "9": 15,
    " ": 7,
    "!": 7,
    "\"": 9,
    "#": 16,
    "$": 15,
    "%": 20,
    "&": 17,
    "'": 5,
    "(": 9,
    ")": 10,
    "*": 12,
    "+": 15,
    ",": 6,
    "-": 9,
    ".": 8,
    "/": 11,
    ":": 7,
    ";": 6,
    "<": 14,
    "=": 15,
    ">": 14,
    "?": 13,
    "@": 24,
    "A": 18,
    "B": 17,
    "C": 18,
    "D": 18,
    "E": 15,
    "F": 15,
    "G": 18,
    "H": 19,
    "I": 8,
    "J": 15,
    "K": 17,
    "L": 15,
    "M": 24,
    "N": 19,
    "O": 19,
    "P": 17,
    "Q": 19,
    "R": 17,
    "S": 16,
    "T": 16,
    "U": 18,
    "V": 17,
    "W": 24,
    "X": 17,
    "Y": 16,
    "Z": 16,
    "[": 7,
    "\\": 11,
    "]": 7,
    "^": 12,
    "_": 12,
    "`": 9,
    "a": 15,
    "b": 15,
    "c": 14,
    "d": 15,
    "e": 14,
    "f": 10,
    "g": 15,
    "h": 15,
    "i": 7,
    "j": 7,
    "k": 14,
    "l": 7,
    "m": 24,
    "n": 15,
    "o": 15,
    "p": 15,
    "q": 15,
    "r": 10,
    "s": 14,
    "t": 9,
    "u": 15,
    "v": 13,
    "w": 20,
    "x": 14,
    "y": 13,
    "z": 14,
    "{": 9,
    "|": 7,
    "}": 9,
    "~": 18
};

const getTextWidth = str => {

    let totalWidth = 0;

    for (let char of str) {

        let charWidth = robotoMediumWidths[char];

        // if no char width provided, use char width for 'x'
        if (charWidth == null) {

            charWidth = robotoMediumWidths["x"];
        }

        totalWidth += charWidth;
    }

    return totalWidth;
}

const svgTextWrap = (str, colour, x, y, dx, dy, wrap) => {
    
    if (typeof wrap !== "number") {

        return `<text>'${wrap}' is not a number!</text>`;
    }

    const words = str.split(" ");

    const spaceWidth = robotoMediumWidths[" "];

    let first = true;

    let totalWidth = 0
    let currentText = "";

    let output = `<text fill="${colour}" x="${x}" y="${y}" font-size="27" font-family="Roboto Medium">`;

    for (let word of words) {

        let wordWidth = getTextWidth(word);

        if (totalWidth + wordWidth > wrap) {
            
            output += `<tspan x="${x}" dx="${dx}" dy="${first === true ? 0 : dy}">${currentText.trim()}</tspan>`;

            first = false;

            totalWidth = 0;
            currentText = "";
        }

        totalWidth += wordWidth + spaceWidth;
        currentText += word + " ";
    }

    output += `<tspan x="${x}" dx="${dx}" dy="${first === true ? 0 : dy}">${currentText.trim()}</tspan></text>`;

    return output;
}

const getsvgTextOverlay = opt => {

    return Buffer.from(
        `<svg width="800" height="750"> 
            
            <filter id="dropshadow-small" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0"/> <!-- stdDeviation is how much to blur -->
                <feOffset dx="1" dy="2" result="offsetblur"/> <!-- how much to offset -->
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.6"/> <!-- slope is the opacity of the shadow -->
                </feComponentTransfer>
                <feMerge> 
                    <feMergeNode/> <!-- this contains the offset blurred image -->
                    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
                </feMerge>
            </filter>

            <filter id="dropshadow-large" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0"/> <!-- stdDeviation is how much to blur -->
                <feOffset dx="3" dy="5" result="offsetblur"/> <!-- how much to offset -->
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.6"/> <!-- slope is the opacity of the shadow -->
                </feComponentTransfer>
                <feMerge> 
                    <feMergeNode/> <!-- this contains the offset blurred image -->
                    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
                </feMerge>
            </filter>

            <rect x="398" y="148" width="${opt.progressbarWidth}" height="39" fill="${opt.progressbarColour}"></rect>
        
            <text style="filter:url(#dropshadow-large)" x="12" y="383" font-size="70" font-family="Uni Sans Heavy CAPS" fill="${opt.usernameColour}">${opt.username}</text>
            <text style="filter:url(#dropshadow-large)" text-anchor="middle" x="562" y="125" font-size="92" font-family="Uni Sans Heavy CAPS" fill="${opt.levelColour}">${opt.level}</text>
            <text style="filter:url(#dropshadow-small)" text-anchor="middle" x="560" y="177" font-size="28" font-family="Uni Sans Heavy CAPS" fill="${opt.progressColour}">${opt.progress}</text>
            <text style="filter:url(#dropshadow-large)" text-anchor="middle" x="560" y="253" font-size="57" font-family="Uni Sans Heavy CAPS" fill="${opt.rankColour}">${opt.rank}</text>
            ${svgTextWrap(opt.about, opt.aboutColour, opt.x, opt.y, opt.dx, opt.dy, opt.wrap)}

        </svg>`
    );
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

        //const ts0 = performance.now();

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

        //const ts1 = performance.now();

        //const td0 = performance.now();

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
                                colours: "$colours",
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
                        colours: "$arr.colours",
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

                //let net0;
                //let net1;

                //const td1 = performance.now();

                //const tr0 = performance.now();

                const levelData = getLevelData(users[0].xp);

                const svg = getsvgTextOverlay({
                    progressbarWidth: Math.floor(325 * levelData.progress),
                    progressbarColour: "#14b252",
                    username: searchUser.username,
                    usernameColour: "#ffffff",
                    level: `level ${levelData.level}`,
                    levelColour: "#14b252",
                    progress: `${Math.floor(levelData.progress * 100)}%`,
                    progressColour: "#ffffff",
                    rank: `#${users[0].globalRank + 1}/${users[0].globalTotal}`,
                    rankColour: "#14b252",
                    about: users[0].bio,
                    aboutColour: "#000000",
                    x: 24,
                    y: 498,
                    dx: 0,
                    dy: 33,
                    wrap: 350
                });

                // cache teehee
                // improvement: check if the change in trophies would actually affect the pf (some may not be drawn)
                let cachedBase = cache.find(e => e.discord_id === users[0].discord_id);
                if (cachedBase != null && (cachedBase.avatarURL !== searchUser.avatarURL || cachedBase.banner !== users[0].banner || JSON.stringify(cachedBase.trophies) !== JSON.stringify(users[0].trophies))) {

                    cache.splice(cache.indexOf(cachedBase), 1);
                    cachedBase = null;
                }
                if (cachedBase == null) {

                    cachedBase = {};

                    cachedBase.discord_id = users[0].discord_id;
                    cachedBase.avatarURL = searchUser.avatarURL;
                    cachedBase.banner = users[0].banner;
                    cachedBase.trophies = users[0].trophies;

                    try {

                        //net0 = performance.now();
                        const banner = rp({ url: users[0].banner, encoding: null }).then(async buffer => {

                            //net1 = performance.now();
                            const banner = sharp({
                                create: {
                                    width: 800,
                                    height: 750,
                                    channels: 4,
                                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                                }}).overlayWith(await sharp(buffer)
                                    .resize(800, 750)
                                    .blur(2)
                                    .toBuffer())
                                .raw()
                                .toBuffer();

                            return await banner;
                        });

                        const pf = rp({ url: searchUser.avatarURL, encoding: null }).then(async buffer => {
    
                            //net1 = performance.now();

                            return await sharp(buffer)
                                .resize(296, 296)
                                .jpeg()
                                .toBuffer();
                        });

                        // sort this shit while the banner/pf async code runs
                        const userTrophies = trophies
                            .filter(e => users[0].trophies.includes(e.dbName))
                            .sort((a, b) => a.importance - b.importance)
                            .slice(0, 8)
                            .map(e => e.buffer);

                        // banner
                        cachedBase.buffer = sharp(await banner, { raw: { width: 800, height: 750, channels: 4 } })
                            .overlayWith(infoCardBase, {
                                gravity: sharp.gravity.centre
                            })
                            .raw()
                            .toBuffer();

                        // trophies
                        let current = 0;

                        cachedBase.buffer = userTrophies
                            .reduce((input, overlay) => {
                                return input.then(data => {
                                    const next = sharp(data, { raw: { width: 800, height: 750, channels: 4 } })
                                        .overlayWith(overlay, {
                                            left: 416 + (current % 4) * 90,
                                            top: 472 + (current > 3 ? 1 : 0) * 90
                                        })
                                        .raw()
                                        .toBuffer();

                                    current++;

                                    return next;
                                });
                            }, cachedBase.buffer);

                        // pfp
                        cachedBase.buffer = sharp(await cachedBase.buffer, { raw: { width: 800, height: 750, channels: 4 } })
                            .overlayWith(await pf, {
                                left: 16, top: 19
                            })
                            .raw()
                            .toBuffer()

                        cache.push(cachedBase);

                    } catch(err) {

                        throw err;
                    }
                }

                try {
                    // changed to measure performance of individual parts of code
                    /*
                    let finished = await sharp(cachedBase.buffer)
                        .overlayWith(svg)
                        .raw()
                        .toBuffer();
                    */

                    /*
                    for (let [i, trophy] of userTrophies.entries()) {

                        // 90 -> trophy size
                        let xoffset = (i % 4) * 90;
                        let yoffset = (i > 3 ? 1 : 0) * 90;

                        finished = await sharp(finished)
                            .overlayWith(trophy.buffer, {
                                left: 416 + xoffset,
                                top: 472 + yoffset
                            })
                            .toBuffer();
                    }
                    */

                    /*
                    let i = -1;

                    const composite =  userTrophies
                        .map(e => e.buffer)
                        .reduce((input, overlay) => {
                            return input.then(data => {

                                i++;

                                return sharp(data, { raw: { width: 800, height: 700, channels: 4 } })
                                    .overlayWith(overlay, {
                                        left: 416 + (i % 4) * 90,
                                        top: 472 + (i > 3 ? 1 : 0) * 90
                                    })
                                    .raw()
                                    .toBuffer();
                            });
                        }, sharp(cachedBase.buffer)
                            .overlayWith(svg)
                            .raw()
                            .toBuffer());

                    let finished = await composite;
                    */

                    const finished = sharp(await cachedBase.buffer, { raw: { width: 800, height: 750, channels: 4 } })
                        .overlayWith(svg)
                        .jpeg()
                        .toBuffer();

                    //const tr1 = performance.now();

                    //const tm0 = performance.now();

                    // await here so start/stop typing works properly
                    await message.channel.send("", {
                        file: await finished
                    });

                    //const tm1 = performance.now();

                    //message.channel.send(`script took ${Math.round((tm1 - ts0) * 100) / 100}ms\n\*search > ${Math.round((ts1 - ts0) * 100) / 100}ms\n\*db > ${Math.round((td1 - td0) * 100) / 100}ms\n\*render > ${Math.round((tr1 - tr0) * 100) / 100}ms, incl. ${Math.round((net1 - net0) * 100) / 100}ms net delay\n\*message > ${Math.round((tm1 - tm0) * 100) / 100}ms`);

                    /*
                    await message.channel.send("", {
                        file: await sharp(cachedBase.buffer)
                            .overlayWith(svg)
                            .webp()
                            .toBuffer()
                    });
                    */

                } catch(err) {

                    throw err;
                }

                if (cache.length > 100) {

                    cache.shift();
                }

                /*
                const fetchImages = [];
                fetchImages.push(rp({ url: users[0].banner, encoding: null }));
                fetchImages.push(rp({ url: message.author.avatarURL, encoding: null }));

                let images;
                try {
                    images = await Promise.all(fetchImages);

                } catch(err) {

                    throw err;
                }

                let font;
                try {
                    font = await sharp(svg)
                        .toBuffer();

                } catch(err) {

                    throw err;
                }

                let pf;
                try {
                    pf = await sharp(images[1])
                        .resize(296, 296)
                        .toBuffer();

                } catch(err) {

                    throw err;
                }

                let banner;
                try {
                    banner = await sharp(images[0])
                        .resize(800, 750)
                        .blur(2)
                        .overlayWith(pf, {
                            left: 16, top: 19
                        })
                        .toBuffer();

                    banner = await sharp(banner)
                        .overlayWith(infoCardBase, {
                            gravity: sharp.gravity.centre
                        })
                        .toBuffer();

                    banner = await sharp(banner)
                        .overlayWith(font)
                        .png()
                        .toBuffer();

                } catch(err) {

                    // temp
                    throw err;
                }

                message.channel.send("", {
                    file: banner
                });
                */

                /*
                // colours
                const defaultColour = "#14b252";
                const defaultNameColour = "#ffffff";

                if (users[0].colours === undefined || users[0].colours === null) {

                    users[0].colours = {};
                }

                if (users[0].colours.progress === undefined || users[0].colours.progress === null) {

                    users[0].colours.progress = defaultColour;
                }

                if (users[0].colours.level === undefined || users[0].colours.level === null) {

                    users[0].colours.level = defaultColour;
                }

                if (users[0].colours.rank === undefined || users[0].colours.rank === null) {

                    users[0].colours.rank = defaultColour;
                }

                if (users[0].colours.name === undefined || users[0].colours.name === null) {

                    users[0].colours.name = defaultNameColour;
                }

                const colours = {};

                for (let colour in users[0].colours) {

                    const rgb = hexToRgb(users[0].colours[colour]);

                    colours[colour] = {
                        hex: users[0].colours[colour],
                        rgb
                    };
                }
                */
                //

                /*
                const bg = new jimp(800, 750);

                let banner = await jimp.read(users[0].banner);
                //let banner = await jimp.read("https://cdn.discordapp.com/attachments/449655476297138177/502508170019864586/tweekxcraig.png");
                if (banner === undefined) {

                    banner = defaultBanner;
                }

                const prop = banner.bitmap.width / banner.bitmap.height;
                if (prop >= (bg.bitmap.width) / bg.bitmap.height) {

                    // change height
                    const heightDiff = bg.bitmap.height - banner.bitmap.height;
                    banner.resize(banner.bitmap.width + (heightDiff * prop), banner.bitmap.height + heightDiff);

                    banner.crop((banner.bitmap.width / 2) - bg.bitmap.width / 2, 0, bg.bitmap.width, bg.bitmap.height);
                    banner.blur(2);

                    bg.composite(banner, 0, 0);

                } else {

                    // change width
                    const widthDiff = bg.bitmap.width - banner.bitmap.width;
                    banner.resize(banner.bitmap.width + widthDiff, banner.bitmap.height + (widthDiff * prop));

                    banner.crop((banner.bitmap.width / 2) - bg.bitmap.width / 2, 0, bg.bitmap.width, bg.bitmap.height);
                    banner.blur(2);

                    bg.composite(banner, 0, 0);
                }

                bg.composite(infoCardBase, 0, 0);

                const levelData = getLevelData(users[0].xp);

                // 398 148 723 187
                const progress = new jimp(Math.floor(325 * levelData.progress), 39);
                progress.opaque();
                magicRecolour(progress, { r: 0, g: 0, b: 0, a: 255 }, { r: colours.progress.rgb.r, g: colours.progress.rgb.g, b: colours.progress.rgb.b, a: 255 }, 160);

                bg.composite(progress, 398, 148);

                printCenter(bg, fontPercent, 161, 146, `${Math.floor(levelData.progress * 100)}%`, 800);
    
                // 16 19 296
                const avatar = await jimp.read(`https://cdn.discordapp.com/avatars/${searchUser.id}/${searchUser.avatar}.png?size=512`);
                avatar.resize(296, 296);
                bg.composite(avatar, 16, 19);
    
                //printCenter(bg, fontLevel, 163, 35, `Level ${levelData.level}`, 800);
                const levelText = plainText(fontLevel, `Level ${levelData.level}`); 
                magicRecolour(levelText, { r: 20, g: 178, b: 82, a: 255 }, { r: colours.level.rgb.r, g: colours.level.rgb.g, b: colours.level.rgb.b, a: 255 }, 160);
                bg.composite(levelText, (bg.bitmap.width / 2) - (levelText.bitmap.width / 2) + 173, 40);

                //printCenter(bg, fontRank, 165, 195, `#${users[0].globalRank + 1}/${users[0].globalTotal}`, 800);
                const rankText = plainText(fontRank, `#${users[0].globalRank + 1}/${users[0].globalTotal}`);
                magicRecolour(rankText, { r: 20, g: 178, b: 82, a: 255 }, { r: colours.rank.rgb.r, g: colours.rank.rgb.g, b: colours.rank.rgb.b, a: 255 }, 160);
                bg.composite(rankText, (bg.bitmap.width / 2) - (rankText.bitmap.width / 2) + 165, 200);

                //colourPrint(bg, fontName, 15, 321, searchUser.username, "#000000");

                const shadowText = plainText(fontName, searchUser.username);
                magicRecolour(shadowText, { r: 255, g: 255, b: 255, a: 255 }, { a: 0, g: 0, b: 0, a: 160 }, 256);
                bg.composite(shadowText, 15, 321);
                
                colourPrint(bg, fontName, 12, 316, searchUser.username, colours.name.hex);

                //bg.print(fontName, 12, 316, searchUser.username);
    
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

                bg.print(fontAbout, 24, 472, changed === true ? `${modifiedAbout}...` : modifiedAbout, 290);

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
                */
            })
            .catch(error => {

                message.reply(`error sending profile: ${error}`);
            });
        },

        load: function () {
            return new Promise(async (resolve, reject) => {

                infoCardBase = await sharp(path.join(__dirname, "..", "assets", "profiles", "info_card_base.png"))
                    .png()
                    .toBuffer();
                
                const trophy1 = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-1.0.png"))
                    .png()
                    .toBuffer();
                const trophy2 = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-2.0.png"))
                    .png()
                    .toBuffer();
                const trophyArt = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-art.png"))
                    .png()
                    .toBuffer();
                const trophyBot = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-bot.png"))
                    .png()
                    .toBuffer();
                const trophyChinpokomon = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-chinpokomon.png"))
                    .png()
                    .toBuffer();
                const trophyCode = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-code.png"))
                    .png()
                    .toBuffer();
                const trophyCrayon = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-crayon.png"))
                    .png()
                    .toBuffer();
                const trophyFs = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-fs.png"))
                    .png()
                    .toBuffer();
                const trophyGroup = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-group.png"))
                    .png()
                    .toBuffer();
                const trophyMod = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-mod.png"))
                    .png()
                    .toBuffer();
                const trophyPatreon = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-patreon.png"))
                    .png()
                    .toBuffer();
                const trophyTrans = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-trans.png"))
                    .png()
                    .toBuffer();
                const trophyVerified = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-verified.png"))
                    .png()
                    .toBuffer();
                const trophyChristmas = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-christmas.png"))
                    .png()
                    .toBuffer();
                
                const trophyShit = await sharp(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-shit.png"))
                    .png()
                    .toBuffer();

                // await sharp(trophyFs).tint("#ff594f").toBuffer()
                trophies.push({
                    dbName: "feinwaru-dev",
                    importance: 0,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 255, g: 89, b: 79, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyFs, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyMod).tint("#099b10").toBuffer()
                trophies.push({
                    dbName: "mod",
                    importance: 1,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 9, g: 155, b: 16, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyMod, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyGroup).tint("#1cb891").toBuffer()
                trophies.push({
                    dbName: "partner",
                    importance: 2,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 28, g: 184, b: 145, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyGroup, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyBot).tint("#ff594f").toBuffer()
                trophies.push({
                    dbName: "bot",
                    importance: 3,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 255, g: 89, b: 79, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyBot, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyPatreon).tint("#fb664e").toBuffer()
                trophies.push({
                    dbName: "patron-1",
                    importance: 4,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 251, g: 102, b: 78, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyPatreon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyPatreon).tint("#fb664e").toBuffer()
                trophies.push({
                    dbName: "patron-5",
                    importance: 5,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 251, g: 102, b: 78, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyPatreon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyPatreon).tint("#fb664e").toBuffer()
                trophies.push({
                    dbName: "patron-10",
                    importance: 6,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 251, g: 102, b: 78, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyPatreon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyTrans).tint("#1c65b8").toBuffer()
                trophies.push({
                    dbName: "translator",
                    importance: 7,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 28, g: 101, b: 184, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyTrans, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyArt).tint("#df3cb6").toBuffer()
                trophies.push({
                    dbName: "artist",
                    importance: 8,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 223, g: 60, b: 182, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyArt, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyChinpokomon).tint("#d67f0e").toBuffer()
                trophies.push({
                    dbName: "uchinpokomon",
                    importance: 9,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 214, g: 127, b: 14, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyChinpokomon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyChinpokomon).tint("#fd9a19").toBuffer()
                trophies.push({
                    dbName: "rchinpokomon",
                    importance: 10,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 253, g: 154, b: 25, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyChinpokomon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                trophies.push({
                    dbName: "christmas-comp",
                    importance: 11,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 173, g: 17, b: 35, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyChristmas, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                trophies.push({
                    dbName: "1kshits",
                    importance: 12,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 122, g: 81, b: 63, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyShit, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyArt).tint("#fd9a19").toBuffer()
                trophies.push({
                    dbName: "ac18_1",
                    importance: 13,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 253, g: 154, b: 25, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyArt, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyArt).tint("#838383").toBuffer()
                trophies.push({
                    dbName: "ac18_2",
                    importance: 14,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 131, g: 131, b: 131, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyArt, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyArt).tint("#a55029").toBuffer()
                trophies.push({
                    dbName: "ac18_3",
                    importance: 15,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 164, g: 80, b: 41, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyArt, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyArt).tint("#7289DA").toBuffer()
                trophies.push({
                    dbName: "ac18_ww",
                    importance: 16,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 114, g: 137, b: 218, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyArt, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCrayon).tint("#fd9a19").toBuffer()
                trophies.push({
                    dbName: "cc18_1",
                    importance: 17,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 253, g: 154, b: 25, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCrayon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCrayon).tint("#838383").toBuffer()
                trophies.push({
                    dbName: "cc18_2",
                    importance: 18,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 131, g: 131, b: 131, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCrayon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCrayon).tint("#a55029").toBuffer()
                trophies.push({
                    dbName: "cc18_3",
                    importance: 19,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 165, g: 80, b: 41, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCrayon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCrayon).tint("#7289DA").toBuffer()
                trophies.push({
                    dbName: "cc18ww",
                    importance: 20,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 114, g: 137, b: 218, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCrayon, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophy1).tint("#4e9ffb").toBuffer()
                trophies.push({
                    dbName: "awesomo-1",
                    importance: 21,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 78, g: 159, b: 251, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophy1, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophy2).tint("#68358a").toBuffer()
                trophies.push({
                    dbName: "awesomo-2",
                    importance: 22,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 104, g: 53, b: 138, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophy2, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCode).tint("#222222").toBuffer()
                trophies.push({
                    dbName: "verified-script",
                    importance: 23,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 34, g: 34, b: 34, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCode, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                // await sharp(trophyCode).tint("#222222").toBuffer()
                trophies.push({
                    dbName: "featured-script",
                    importance: 24,
                    buffer: await sharp({
                        create: {
                            width: 90,
                            height: 90,
                            channels: 4,
                            background: { r: 34, g: 34, b: 34, alpha: 1.0 }
                        }
                    })
                    .overlayWith(trophyCode, {
                        cutout: true
                    })
                    .png()
                    .toBuffer()
                });

                /*
                fontLevel = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontLevel.fnt"));
                fontPercent = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontPercent.fnt"));
                fontRank = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontRank.fnt"));
                fontName = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontName.fnt"));
                fontSection = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontSection.fnt"));
                fontAbout = await jimp.loadFont(path.join(__dirname, "..", "assets", "profiles", "fonts", "fontAbout.fnt"));
    
                infoCardBase = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "info_card_base.png"));
                verifiedIcon = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "verified.png"));
                defaultBanner = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "404.jpg"));

                const trophy1 = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-1.0.png"));
                const trophy2 = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-2.0.png"));
                const trophyArt = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-art.png"));
                const trophyBot = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-bot.png"));
                const trophyChinpokomon = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-chinpokomon.png"));
                const trophyCode = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-code.png"));
                const trophyCrayon = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-crayon.png"));
                const trophyFs = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-fs.png"));
                const trophyGroup = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-group.png"));
                const trophyMod = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-mod.png"));
                const trophyPatreon = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-patreon.png"));
                const trophyTrans = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-trans.png"));
                const trophyVerified = await jimp.read(path.join(__dirname, "..", "assets", "profiles", "trophies", "trophy-verified.png"));

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
                */

                resolve();
            });
        }
});

module.exports = levels;
