"use strict";

const rp = require("request-promise-native");
const path = require("path");
const fs = require("fs");
const prefix = "!"
const Axios = require('axios')
const discord = require("discord.js");
const jimp = require("jimp");
const Command = require("../script");
const {
    similarity,
    jimp: {
        printCenter,
        printCenterCenter
    }
} = require("../../utils");

const config = require("../../../config.json");
//const cards = require("../assets/cards/cards.json");

let sp16Font = null;
let sp18Font = null;
let sp25Font = null;
let sp27Font = null;
let sp60Font = null;

let frameOverlays = null;
let frameOutlines = null;
let frameTops = null;
let typeIcons = null;
let miscIcons = null;

function camelPad(str) {
    return str
        // Look for long acronyms and filter out the last letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, " $1 $2")
        // Look for lower-case letters followed by upper-case letters
        .replace(/([a-z\d])([A-Z])/g, "$1 $2")
        // Look for lower-case letters followed by numbers
        .replace(/([a-zA-Z])(\d)/g, "$1 $2")
        .replace(/^./, function (str) {
            return str.toUpperCase();
        })
        // Remove any white space left around the word
        .trim();
}

let cache = {
    date: 2,
    cachedData: ""
}

const readDir = dirPath => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (error, files) => {
            if (error == null) {
                return resolve(files);
            }
            reject(err);
        });
    });
};

const card = new Command({

    name: "Phone Destroyer Cards",
    description: "View any card from phone destroyer, rendered in real time with full stats!",
    help: "```\n[prefix]card <card name> <level / upgrade level>```\n*Replace items in triangle brackets with:*\n\n**card name:** Any existing Phone Destroyer card's name! If not spelt correctly, AWESOM-O will try to match the name.\n\n**level:** Simply put an l followed by 2, 3, 4, 5, 6 or 7 in this field and the card will display information from that level! You can also do ff to see the starts of a card in a friendly match! *(Common - lvl 4/Rare - lvl 3/Epic - lvl2/Legendary - lvl1)*\n\n**upgrade level:** Put a u followed by any number from 2 - 70 to see the specific stats of your card at a specific upgrade level! You can also do m followed by 1 - 7 to show the max upgrade for that level.\n\n**Example:** [prefix]card Towelie 6 **or** [prefix]card Towelie u42.",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099660711821312/card.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "card",

    featured: false,

    preload: true,

    // -card <name>
    cb: async function (client, message, guild) {

        if (Date.now() - new Date(cache.date) > 1000 * 60 * 60) {
            await rp("https://sppd.feinwaru.com/api/v1/cards/list")
                .then(async responseCache => {
                    const requestCache = JSON.parse(responseCache)

                    cache.date = new Date()
                    cache.cachedData = requestCache
                })
                .catch(error => {
                    console.error(error)
                    const discordEmbed = new discord.RichEmbed()
                        .setColor('#F8534F')
                        .setTitle(":x: 1");
                    message.channel.send(discordEmbed);
                });
        }

        rp("https://sppd.feinwaru.com/api/v1/cards/list")
            .then(async response => {

                const cards = JSON.parse(response);


                // <prefix>card <name> | %r (<number | %r> | l<number | %r> | u<number | %r> | m<number | %r> | art | ff )

                // -card %r l5 DONE 
                // make it so you can only enter one of the following: a number (for the level), l<number>, u<number>, m<number>, ff, art DONE
                // extract the info entered after the card name, eg. { paramType: "level", value: 5 } from l5 DONE
                // make it so you can do %r instead of the numbers after l, u, m, eg. l%r, or u%r, which will select a random value within bounds e.g. (1-7 for l, m, and 1-70 for u) DONE

                const split = message.content.split(" ");

                const splitWithoutCmd = split.slice(1);

                //this is a fucking mess dont bother
                let cardName = [];

                let cardstats = []

                let commandValues = []

                let cardValues = ""

                //gets name
                for (let cmdWord of splitWithoutCmd) {

                    if (cmdWord === "ff" || cmdWord === "art" || (cmdWord.startsWith("l") || cmdWord.startsWith("m") || cmdWord.startsWith("u")) && (!isNaN(parseInt(cmdWord.slice(1))) || cmdWord.slice(1) === "%r")) {
                        continue;
                    }

                    cardName.push(cmdWord);

                }


                //more code handling
                cardName = cardName.join(" ").toLowerCase();
                commandValues.name = cardName

                //randomizes card
                if (commandValues.name === "%r") {
                    commandValues.name = cards.data[Math.floor(Math.random() * cards.data.length)].name
                }

                //checks it has level shit
                for (let stats of splitWithoutCmd) {

                    if (stats === "ff" || stats === "art" || (stats.startsWith("l") || stats.startsWith("m") || stats.startsWith("u")) && (!isNaN(parseInt(a.slice(1))) || /%r$/g.test(a))) {

                        cardstats.push(a)
                    }
                }


                //code handling
                if (cardstats.length != 0) {
                    if (cardstats.length > 1) {
                        return console.error("aha")
                    }

                    cardValues = cardstats[0]

                    if (cardValues.length > 3) {
                        return console.error("noo")
                    }

                    if (isNaN(parseInt(cardValues.slice(1)))) {
                        commandValues.modifier = cardstats[0]
                    } else {

                        commandValues.modifier = cardValues[0]

                        if (cardValues.length == 3) {
                            commandValues.value = cardValues.substr(1, 2)
                        }
                        if (cardValues.length == 2) {
                            commandValues.value = cardValues[1]
                        }

                    }
                    //randomizes level
                    if (cardValues.slice(1) === "%r" && cardValues[0] === "u") {
                        commandValues.upgrade = Math.floor(Math.random() * 70) + 1
                        commandValues.modifier = cardValues[0]
                    }
                    if (cardValues.slice(1) === "%r" && (cardValues[0] === "l" || cardValues[0] === "m")) {
                        commandValues.value = Math.floor(Math.random() * 7) + 1
                        commandValues.modifier = cardValues[0]
                    }
                }

                //checks if values are within bounds and some hardcoded shit
                if (((commandValues.modifier == "m") || (commandValues.modifier === "l")) && ((commandValues.value > 7) || (commandValues.value < 1))) {
                    return console.log("out of bounds")
                }

                if (commandValues.modifier == "u" && ((commandValues.value > 70) || (commandValues.value < 1))) {
                    return console.log("out of bounds")
                }
                if (commandValues.modifier === undefined) {
                    commandValues.modifier = "l"
                }
                if (commandValues.value === undefined) {
                    commandValues.value = 1
                }

                if (commandValues.upgrade === undefined) {
                    commandValues.upgrade = 1
                }

                if (commandValues.name === "%r %r") {
                    commandValues.name = cards.data[Math.floor(Math.random() * cards.data.length)].name
                    commandValues.modifier = "l"
                    commandValues.value = Math.floor(Math.random() * 7)
                }
                if (commandValues.modifier == "u") {
                    commandValues.upgrade = commandValues.value
                    commandValues.value = 1
                }
                commandValues.value = parseInt(commandValues.value)
                commandValues.upgrade = parseInt(commandValues.upgrade)

                let highestToDate = 0;
                let highestCard = null;


                // card name - similarity
                for (let card of cards.data) {
                    const lowerArray = card.name.toLowerCase();

                    let sim = similarity(lowerArray, commandValues.name)

                    if (sim > highestToDate) {
                        highestToDate = sim;
                        highestCard = card;
                    }

                }

                if (highestToDate < 0.4) {
                    console.error("Card Not Found");
                }
                commandValues.matchedCards = highestCard
                commandValues.similarity = highestToDate

                const cars = ["ford-lemon", "lambo-range", "ferra-pple", "peug-rapes"];

                const url = "https://sppd.feinwaru.com/backgrounds/" + commandValues.matchedCards.image + ".jpg"

                const pathResolve = path.resolve(__dirname, '../assets/cards/art/', commandValues.matchedCards.image + ".jpg")

                const directoryPath = path.join(__dirname, '../assets/cards/art/');

                await readDir(directoryPath)
                    .then(async files => {

                        let result = true;
                        for (let downloadfiles of files) {
                            if (downloadfiles.includes(commandValues.matchedCards.image + ".jpg")) {
                                result = false;
                            }
                        }
                        
                        if (result) {
                            const response = await Axios({
                                method: 'GET',
                                url,
                                responseType: 'stream'
                            })
    
                            await response.data.pipe(fs.createWriteStream(pathResolve))
    
                            await (new Promise((resolve, reject) => {
                                response.data.on('end', () => {
                                    resolve()
                                })
                                
                                response.data.on('error', error => {
                                    reject(error)
                                })
                            }));
                        }
                    })
                    
                    .catch(console.error);

                const cardId = commandValues.matchedCards._id
                console.log(commandValues)

                rp("https://sppd.feinwaru.com/api/v1/cards/" + cardId)
                    .then(async response1 => {

                        const data1 = JSON.parse(response1);

                        let cardData = data1.data

                        const getUpgradeStats = (currentCard, upgrade) => {
                            if (upgrade < 1 || upgrade > 70) {
                                console.log("oooof");
                                return {};
                            }
                            const stats = {
                                upgrade
                            };
                            if (currentCard.powers.length === "0") {
                                for (let k in currentCard) {

                                    if (k.powers[0].startsWith("power") === true && currentCard[k] !== null && currentCard[k] !== "") {
                                        stats[k] = currentCard[k];
                                    }

                                    // exceptions cos redlynx gay
                                    if (k.powers[0] === "charged_power_radius") {
                                        stats["power_range"] = currentCard[k];
                                    }
                                }
                            }

                            stats.health = parseInt(currentCard.health);
                            if (isNaN(stats.health)) {
                                console.log("of");
                                return {};
                            }
                            stats.damage = parseInt(currentCard.damage);
                            if (isNaN(stats.damage)) {
                                console.log("oof");
                                return {};
                            }
                            // PowerTarget patch - see sppd for better explanation - if you havent noticed yet,
                            // i dont care about code quality here - if you want better code quality, see sppd

                            if (currentCard.type === "spell" || currentCard.tech_tree.levels[0].slots.reduce((p, c) => p || c.property === "power_target_abs", false)) {
                                if (currentCard.tech_tree.levels[0].slots.reduce((p, c) => p || c.property === "power_target_abs", false)) {
                                    stats["power_target"] = 1;
                                }
                                if (currentCard.type === "spell") {
                                    return stats;
                                }
                            }
                            for (let i = 0; i < upgrade - 1; i++) {
                                if (currentCard.tech_tree.slots[i].id !== undefined) {
                                    stats.ability = true;
                                    continue;
                                }
                                if (currentCard.tech_tree.slots[i].property === "max_health") {
                                    stats.health += currentCard.tech_tree.slots[i].value;
                                }
                                if (currentCard.tech_tree.slots[i].property === "damage") {
                                    stats.damage += currentCard.tech_tree.slots[i].value;
                                }
                                if (currentCard.tech_tree.slots[i].property.indexOf("abs") !== -1) {
                                    const propertyAbs = currentCard.tech_tree.slots[i].property;
                                    const property = propertyAbs.slice(0, propertyAbs.length - 3);
                                    if (stats[property] === undefined) {
                                        console.log("ooof");
                                        return {};
                                    } else {
                                        stats[property] += currentCard.tech_tree.slots[i].value;
                                    }
                                }
                            }
                            let levelModifier = 0;
                            if (upgrade > 5) {
                                levelModifier++;
                            }
                            if (upgrade > 15) {
                                levelModifier++;
                            }
                            if (upgrade > 25) {
                                levelModifier++;
                            }
                            if (upgrade > 40) {
                                levelModifier++;
                            }
                            if (upgrade > 55) {
                                levelModifier++;
                            }
                            for (let i = 0; i < levelModifier; i++) {
                                for (let j = 0; j < currentCard.tech_tree.levels[i].slots.length; j++) {
                                    if (currentCard.tech_tree.levels[i].slots[j].property === "max_health") {
                                        stats.health += currentCard.tech_tree.levels[i].slots[j].value;
                                    }
                                    if (currentCard.tech_tree.levels[i].slots[j].property === "damage") {
                                        stats.damage += currentCard.tech_tree.levels[i].slots[j].value;
                                    }
                                    if (currentCard.tech_tree.levels[i].slots[j].property.indexOf("Abs") !== -1) {
                                        const propertyAbs = currentCard.tech_tree.levels[i].slots[j].property;
                                        const property = propertyAbs.slice(0, propertyAbs.length - 3);
                                        if (stats[property] === undefined) {
                                            console.log("ooooof");
                                            return {};
                                        } else {
                                            stats[property] += currentCard.tech_tree.levels[i].slots[j].value;
                                        }
                                    }
                                }
                            }
                            return stats;
                        };

                        const getLevelStats = (currentCard, level) => {
                            if (level < 1 || level > 7) {
                                console.log("oooooof");
                                return {};
                            }
                            if (level === 1) {
                                return getUpgradeStats(currentCard, 1);
                            }
                            let upgradeModifier = 0;
                            if (level === 2) {
                                upgradeModifier += 5;
                            }
                            if (level === 3) {
                                upgradeModifier += 15;
                            }
                            if (level === 4) {
                                upgradeModifier += 25;
                            }
                            if (level === 5) {
                                upgradeModifier += 40;
                            }
                            if (level === 6) {
                                upgradeModifier += 55;
                            }
                            if (level === 7) {
                                upgradeModifier += 70;
                            }
                            const stats = getUpgradeStats(currentCard, upgradeModifier);
                            stats.level = level;
                            if (currentCard.type === "spell") {
                                for (let i = 0; i < level - 1; i++) {
                                    for (let j = 0; j < currentCard.tech_tree.levels[i].slots.length; j++) {
                                        if (currentCard.tech_tree.levels[i].slots[j].property === "max_health") {
                                            stats.health += currentCard.tech_tree.levels[i].slots[j].value;
                                        }
                                        if (currentCard.tech_tree.levels[i].slots[j].property === "damage") {
                                            stats.damage += currentCard.tech_tree.levels[i].slots[j].value;
                                        }
                                        if (currentCard.tech_tree.levels[i].slots[j].property.indexOf("abs") !== -1) {
                                            const propertyAbs = currentCard.tech_tree.levels[i].slots[j].property;
                                            const property = propertyAbs.slice(0, propertyAbs.length - 3);
                                            if (stats[property] === undefined) {
                                                console.log("ooooof");
                                                return {};
                                            } else {
                                                stats[property] += currentCard.tech_tree.levels[i].slots[j].value;
                                            }
                                        }
                                    }
                                }
                            } else {
                                const currentLevel = currentCard.tech_tree.levels[level - 2];
                                for (let i = 0; i < currentLevel.slots.length; i++) {
                                    if (currentLevel.slots[i].property === "max_health") {
                                        stats.health += currentLevel.slots[i].value;
                                    }
                                    if (currentLevel.slots[i].property === "damage") {
                                        stats.damage += currentLevel.slots[i].value;
                                    }
                                    if (currentLevel.slots[i].property.indexOf("abs") !== -1) {
                                        const propertyAbs = currentLevel.slots[i].property;
                                        const property = propertyAbs.slice(0, propertyAbs.length - 3);
                                        if (stats[property] === undefined || property === "power_target") {
                                            if (property === "power_target") {
                                                stats[property] = level;
                                            } else {
                                                console.log("ooooooof");
                                                return {};
                                            }
                                        } else {
                                            stats[property] += currentLevel.slots[i].value;
                                        }
                                    }
                                }
                            }
                            return stats;
                        };

                        const getMaxUpgradeStats = (currentCard, level) => {
                            if (level < 1 || level > 7) {
                                console.log("oooooof");
                                return {};
                            }

                            if (currentCard.type === "spell" || level === 7) {

                                return getLevelStats(currentCard, level);
                            }

                            let upgradeModifier = 0;
                            if (level === 1) {
                                upgradeModifier += 5;
                            }
                            if (level === 2) {
                                upgradeModifier += 15;
                            }
                            if (level === 3) {
                                upgradeModifier += 25;
                            }
                            if (level === 4) {
                                upgradeModifier += 40;
                            }
                            if (level === 5) {
                                upgradeModifier += 55;
                            }
                            if (level === 6) {
                                upgradeModifier += 70;
                            }

                            return getUpgradeStats(currentCard, upgradeModifier);
                        };

                        const renderFrames = async (cards, outputDir = path.join(__dirname, "temp", "cards")) => {

                            for (let card of cards) {

                                const level = 1;
                                const stats = getLevelStats(card, level);

                                for (let stat in stats) {

                                    if (stat === "damage" || stat == "health") {

                                        continue;
                                    }

                                    if (stat === "power_hero_damage") {

                                        // scale based on base stats
                                        stats[stat] = stats["power_damage"] * (card.PowerHerodamage / card.Powerdamage);
                                    }

                                    if (stat === "power_max_hp_gain") {

                                        card.description = card.description.replace("{power_max_health_boost}", typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                                        continue;
                                    }

                                    // again, im not even sorry
                                    card.description = card.description.replace(`{${stat}}`, typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                                    card.description = card.description.replace(`{${stat}}`, typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                                }

                                if (card.description.includes("{[power_duration_min]}-{power_duration_max}")) {

                                    card.description = card.description.replace("{power_duration_min}-{power_duration_max}", `${Math.round(stats["power_duration"] * 100) / 100 - 1}-${Math.round(stats["power_duration"] * 100) / 100 + 1} seconds`);
                                }
                                if (card.name instanceof Array ? card.name[0] === "Cock Magic" : card.name === "Cock Magic") {

                                    card.description = card.description.replace("{power_target}", level);
                                }
                                if (card.name instanceof Array ? card.name[0] === "Marcus" : card.name === "Marcus") {

                                    card.description = card.description.replace("{power_hero_damage}", card.powers.value);
                                }
                                if (card.name instanceof Array ? card.name[0] === "Marine Craig" : card.name === "Marine Craig") {

                                    card.description = card.description.replace("{power_hero_poison}", card.card.powers.value);
                                }

                                if (card.name instanceof Array ? card.name[0] === "Shieldmaiden Wendy" : card.name === "Shieldmaiden Wendy") {

                                    card.description = card.description.slice(0, card.description.length - 1);
                                }
                                if (card.name instanceof Array ? card.name[0] === "Youth Pastor Craig" : card.name === "Youth Pastor Craig") {

                                    card.description = card.description.slice(0, card.description.length - 1);
                                }

                                // trap vs spell
                                const typetype = card.type;
                                //

                                /* --- pasted old code --- */

                                // Get the frame outline.
                                const frameWidth = 305;
                                const frameHeight = 418;

                                let x, y, z, w;

                                switch (card.rarity) {
                                    case 0: // common
                                        y = 0;
                                        switch (card.theme) {
                                            case "adventure":
                                                x = frameWidth;
                                                break;
                                            case "sci-fi":
                                                x = frameWidth * 2;
                                                break;
                                            case "mystical":
                                                x = frameWidth * 3;
                                                break;
                                            case "fantasy":
                                                x = frameWidth * 4;
                                                break;
                                            case "superhero":
                                                x = frameWidth * 5;
                                                break;
                                            case "general":
                                                x = 0;
                                                break;
                                            default:
                                                //message.reply("theme not found");
                                                return;
                                        }
                                        break;
                                    default:
                                        y = frameHeight;
                                        switch (card.theme) {
                                            case "adventure":
                                                x = frameWidth;
                                                break;
                                            case "sci-fi":
                                                x = frameWidth * 2;
                                                break;
                                            case "mystical":
                                                x = frameWidth * 3;
                                                break;
                                            case "fantasy":
                                                x = frameWidth * 4;
                                                break;
                                            case "superhero":
                                                x = frameWidth * 5;
                                                break;
                                            case "general":
                                                x = 0;
                                                break;
                                            default:
                                                //message.reply("theme not found");
                                                return;
                                        }
                                        break;
                                }

                                z = frameWidth;
                                w = frameHeight;

                                // Get the frame top.
                                const topWidth = 338;
                                const topHeight = 107;

                                let fx, fy, fz, fw;

                                fx = 0;

                                switch (card.rarity) {
                                    case 0: // common
                                        fy = undefined;
                                        break;
                                    case 1:
                                        fy = 0;
                                        break;
                                    case 2:
                                        fy = topHeight;
                                        break;
                                    case 3:
                                        fy = topHeight * 2;
                                        break;
                                    default:
                                        //message.reply("rarity not found");
                                        return;
                                }

                                fz = topWidth;
                                fw = topHeight;

                                // Get the icon.
                                const iconWidth = 116;
                                const iconHeight = 106;

                                let ix, iy, iz, iw;

                                switch (card.character_type) {
                                    case "tank":
                                        iy = 0;
                                        break;
                                    case undefined:
                                        // trap vs spell
                                        switch (typetype) {
                                            case "spell": {
                                                iy = iconHeight * 2;
                                                break;
                                            }
                                            case "trap": {
                                                iy = iconHeight * 14;
                                                break;
                                            }
                                        }
                                        break;
                                    case "assassin":
                                        iy = iconHeight * 4;
                                        break;
                                    case "ranged":
                                        iy = iconHeight * 6;
                                        break;
                                    case "melee":
                                        iy = iconHeight * 8;
                                        break;
                                    case "totem":
                                        iy = iconHeight * 10;
                                        break;
                                }

                                switch (card.rarity) {
                                    case 0: // common
                                        switch (card.theme) {
                                            case "general":
                                                ix = 0;
                                                break;
                                            case "adventure":
                                                ix = iconWidth;
                                                break;
                                            case "sci-fi":
                                                ix = iconWidth * 2;
                                                break;
                                            case "mystical":
                                                ix = iconWidth * 3;
                                                break;
                                            case "fantasy":
                                                ix = iconWidth * 4;
                                                break;
                                            case "superhero":
                                                ix = iconWidth * 5;
                                                break;
                                        }
                                        break;
                                    case 1:
                                        iy += iconHeight;
                                        ix = 0;
                                        break;
                                    case 2:
                                        iy += iconHeight;
                                        ix = iconWidth;
                                        break;
                                    case 3:
                                        iy += iconHeight;
                                        ix = iconWidth * 2;
                                        break;
                                }

                                iz = iconWidth;
                                iw = iconHeight;

                                // Get the overlay.
                                const overlayWidth = 305;
                                const overlayHeight = 418;

                                let ox, oy, oz, ow;

                                oy = 0;

                                switch (card.character_type) {
                                    case undefined:
                                        ox = overlayWidth;
                                        break;
                                    default:
                                        ox = 0;
                                        break;
                                }

                                oz = overlayWidth;
                                ow = overlayHeight;

                                // Card theme icons.
                                const themeIconWidth = 36;
                                const themeIconHeight = 24;

                                let tx, ty, tz, tw;

                                ty = 0;

                                switch (card.theme) {
                                    case "general":
                                        tx = 0;
                                        break;
                                    case "adventure":
                                        tx = themeIconWidth;
                                        break;
                                    case "sci-fi":
                                        tx = themeIconWidth * 2;
                                        break;
                                    case "mystical":
                                        tx = themeIconWidth * 3;
                                        break;
                                    case "fantasy":
                                        tx = themeIconWidth * 4;
                                        break;
                                    case "superhero":
                                        tx = themeIconWidth * 5;
                                        break;
                                    default:
                                        //message.reply("theme not found");
                                        return;
                                }

                                tz = themeIconWidth;
                                tw = themeIconHeight;

                                // Crystal things.
                                const crystalSheet = {
                                    x: 0,
                                    y: 24,
                                    width: 180,
                                    height: 76 // 36 + 4 + 36
                                };

                                const crystalWidth = 36;
                                const crystalHeight = 36;

                                let cx, cy, cz, cw;

                                cy = crystalSheet.y;

                                switch (card.rarity) {
                                    case 0: // common
                                        switch (card.theme) {
                                            case "general":
                                                cx = 0;
                                                break;
                                            case "adventure":
                                                cx = crystalWidth;
                                                break;
                                            case "sci-fi":
                                                cx = crystalWidth * 2;
                                                break;
                                            case "mystical":
                                                cx = crystalWidth * 3;
                                                break;
                                            case "fantasy":
                                                cx = crystalWidth * 4;
                                                break;
                                            case "superhero":
                                                cx = crystalWidth * 5;
                                                break;
                                            default:
                                                //message.reply("theme not found");
                                                return;
                                        }
                                        break;
                                    case 1:
                                        cy += crystalHeight + 4;
                                        cx = 17;
                                        break;
                                    case 2:
                                        cy += crystalHeight + 4;
                                        cx = 34 + crystalWidth;
                                        break;
                                    case 3:
                                        cy += crystalHeight + 4;
                                        cx = 34 + crystalWidth * 2;
                                        break;
                                    default:
                                        //message.reply("rarity not found");
                                        return;
                                }

                                cz = crystalWidth;
                                cw = crystalHeight;

                                if (card.rarity === 3) {
                                    cz += 17;
                                }
                                /* --- end of old code --- */

                                // Make the image.
                                const bgWidth = 455;
                                const bgHeight = 630;

                                // image overlaying stuff.
                                new jimp(800, 1200, (err, bg) => {
                                    let frameOverlay = frameOverlays
                                        .clone()
                                        .crop(ox, oy, oz, ow)
                                        .resize(bgWidth, bgHeight);
                                    let frameOutline = frameOutlines
                                        .clone()
                                        .crop(x, y, z, w)
                                        .resize(bgWidth, bgHeight);
                                    let typeIcon = typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
                                    let themeIcon = miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
                                    let crystal = miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

                                    let frameTop;
                                    if (fy !== undefined) {
                                        frameTop = frameTops
                                            .clone()
                                            .crop(fx, fy, fz, fw)
                                            .resize(bgWidth + 49, 200);
                                    }

                                    /*
                                    bg.composite(
                                      cardArt,
                                      bg.bitmap.width / 2 - cardArt.bitmap.width / 2,
                                      bg.bitmap.height / 2 - cardArt.bitmap.height / 2
                                    );
                                    */
                                    bg.composite(
                                        frameOverlay,
                                        bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2,
                                        bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2
                                    );
                                    bg.composite(
                                        frameOutline,
                                        bg.bitmap.width / 2 - frameOutline.bitmap.width / 2,
                                        bg.bitmap.height / 2 - frameOutline.bitmap.height / 2
                                    );

                                    if (fy !== undefined) {
                                        bg.composite(
                                            frameTop,
                                            bg.bitmap.width / 2 - frameTop.bitmap.width / 2 - 8,
                                            240
                                        );
                                    }

                                    bg.composite(typeIcon, 130, 182);
                                    bg.composite(
                                        themeIcon,
                                        bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168,
                                        843
                                    );

                                    // 3 = legendary
                                    let xoffset = 0;
                                    if (card.rarity === 3) {
                                        xoffset = 25;
                                    }

                                    bg.composite(
                                        crystal,
                                        bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168 - xoffset,
                                        745
                                    );

                                    if (card.name instanceof Array) {
                                        printCenter(bg, sp25Font, 20, 315, card.name[0]);
                                    } else {
                                        printCenter(bg, sp25Font, 20, 315, card.name);
                                    }

                                    printCenter(bg, sp60Font, -168, 350, card.ManaCost.toString());

                                    if (ox === 0) {
                                        printCenter(bg, sp27Font, -168, 515, stats.health.toString());
                                        printCenter(bg, sp27Font, -168, 640, stats.damage.toString());
                                    }

                                    printCenter(bg, sp16Font, 17, 358, level === null ? `u ${0}` : `lvl ${level}`);

                                    printCenterCenter(bg, sp18Font, 20, 510, card.description, 325);

                                    //bg.autocrop(0.002, false);
                                    bg.crop(135, 165, 526, 769);

                                    bg.write(path.join(outputDir, `frame_${card.image}.png`));
                                });

                            }
                        };


                        // deep copy cards so we can replace shit
                        // without worrying about gay object shit
                        const cardsCopy = data1.data

                        // render frames for the website
                        if (config.env != null &&
                            config.env.toLowerCase() === "dev" &&
                            message.content.split(" ")[1] === "dev-frames") {

                            renderFrames(cardsCopy);
                            return;
                        }

                        // legacy command support

                        // card <name>
                        // card <name> <level>
                        // card <name> l<level>
                        // card <name> u<upgrade>

                        let level = commandValues.value;
                        let upgrade = commandValues.upgrade;

                        // card select
                        let card = data1.data;

                        // if name is %r, select a random card


                        // -card <name> (art)
                        // where name is compulsory
                        // and art is optional

                        // find the card by % match

                        if (commandValues.modifier === "art") {

                            return message.channel.send("", {
                                file: path.join(__dirname, "..", "assets", "cards", "art", `${card.image}.jpg`)
                            }).catch(err => {

                                message.channel.send(`error sending card art: ${err}`);
                            });
                        }

                        // friendly-fight/challenge stats
                        // ignore this if the command is -card ff,
                        // and assume 'ff' is a card name instead
                        // this needs to be called after card search
                        // as we need the rarity of the card

                        if (commandValues.modifier === "ff") {

                            level = Math.abs(card.rarity - 4);
                        }

                        let stats = null;

                        if (commandValues.modifier === "u") {
                            stats = getUpgradeStats(card, upgrade);
                        } else {

                            if (commandValues.modifier === ("m")) {

                                stats = getMaxUpgradeStats(card, level);

                                upgrade = stats.upgrade;
                            } else {

                                stats = getLevelStats(card, level);
                            }
                        }

                        for (let stat in stats) {

                            if (stat === "damage" || stat == "health") {

                                continue;
                            }

                            if (stat === "power_hero_damage") {

                                // scale based on base stats
                                stats[stat] = stats["Powerdamage"] * (card.PowerHerodamage / card.Powerdamage);
                            }

                            if (stat === "PowerMaxHPGain") {

                                card.description = card.description.replace("{PowerMaxhealthBoost}", typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);

                                // these inconsistencies will kill me one day 
                                card.description = card.description.replace("{PowerMaxHPGain}", typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                                continue;
                            }

                            // im not even sorry
                            card.description = card.description.replace(`{${stat}}`, typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                            card.description = card.description.replace(`{${stat}}`, typeof stats[stat] === "number" ? Math.round(stats[stat] * 100) / 100 : stats[stat]);
                        }

                        if (card.description.includes("{power_duration_min}-{power_duration_max}")) {

                            card.description = card.description.replace("{PowerDurationMin}-{PowerDurationMax}", `${Math.round(stats["PowerDuration"] * 100) / 100 - 1}-${Math.round(stats["PowerDuration"] * 100) / 100 + 1} seconds`);
                        }
                        if (card.name instanceof Array ? card.name[0] === "Cock Magic" : card.name === "Cock Magic") {

                            card.description = card.description.replace("{PowerTargetAmount}", level);
                        }
                        if (card.name instanceof Array ? card.name[0] === "Marcus" : card.name === "Marcus") {

                            card.description = card.description.replace("{PowerHerodamage}", card.Powerdamage);
                        }
                        if (card.name instanceof Array ? card.name[0] === "Marine Craig" : card.name === "Marine Craig") {

                            card.description = card.description.replace("{PowerHeroPoison}", card.PowerPoisonAmount);
                        }
                        if (card.name instanceof Array ? card.name[0] === "Chicken Coop" : card.name === "Chicken Coop") {

                            card.description = card.description.replace("{PowerInterval.1}", "3.5");
                        }
                        if (card.name instanceof Array ? card.name[0] === "Shieldmaiden Wendy" : card.name === "Shieldmaiden Wendy") {

                            card.description = card.description.slice(0, card.description.length - 1);
                        }
                        if (card.name instanceof Array ? card.name[0] === "Youth Pastor Craig" : card.name === "Youth Pastor Craig") {

                            card.description = card.description.slice(0, card.description.length - 1);
                        }

                        /* --- pasted old code --- */

                        // Get the frame outline.
                        const frameWidth = 305;
                        const frameHeight = 418;

                        let x, y, z, w;

                        switch (card.rarity) {
                            case 0: // common
                                y = 0;
                                switch (card.theme) {
                                    case "adventure":
                                        x = frameWidth;
                                        break;
                                    case "sci-fi":
                                        x = frameWidth * 2;
                                        break;
                                    case "mystical":
                                        x = frameWidth * 3;
                                        break;
                                    case "fantasy":
                                        x = frameWidth * 4;
                                        break;
                                    case "superhero":
                                        x = frameWidth * 5;
                                        break;
                                    case "general":
                                        x = 0;
                                        break;
                                    default:

                                        message.reply("theme not found 1");
                                        return;
                                }
                                break;
                            default:
                                y = frameHeight;
                                switch (card.theme) {
                                    case "adventure":
                                        x = frameWidth;
                                        break;
                                    case "sci-fi":
                                        x = frameWidth * 2;
                                        break;
                                    case "mystical":
                                        x = frameWidth * 3;
                                        break;
                                    case "fantasy":
                                        x = frameWidth * 4;
                                        break;
                                    case "superhero":
                                        x = frameWidth * 5;
                                        break;
                                    case "general":
                                        x = 0;
                                        break;
                                    default:
                                        console.log(commandValues)
                                        message.reply("theme not found 2");
                                        return;
                                }
                                break;
                        }

                        z = frameWidth;
                        w = frameHeight;

                        // Get the frame top.
                        const topWidth = 338;
                        const topHeight = 107;

                        let fx, fy, fz, fw;

                        fx = 0;

                        switch (card.rarity) {
                            case 0: // common
                                fy = undefined;
                                break;
                            case 1:
                                fy = 0;
                                break;
                            case 2:
                                fy = topHeight;
                                break;
                            case 3:
                                fy = topHeight * 2;
                                break;
                            default:
                                message.reply("rarity not found");
                                return;
                        }

                        fz = topWidth;
                        fw = topHeight;

                        // Get the icon.
                        const iconWidth = 116;
                        const iconHeight = 106;

                        let ix, iy, iz, iw;

                        //temp
                        const typetype = card.type;
                        //

                        switch (card.character_type) {
                            case "tank":
                                iy = 0;
                                break;
                            case undefined: {
                                switch (typetype) {
                                    case "spell": {
                                        iy = iconHeight * 2;
                                        break;
                                    }
                                    case "trap": {
                                        iy = iconHeight * 14;
                                        break;
                                    }
                                }
                                break;
                            }
                            case "assassin":
                                iy = iconHeight * 4;
                                break;
                            case "ranged":
                                iy = iconHeight * 6;
                                break;
                            case "melee":
                                iy = iconHeight * 8;
                                break;
                            case "totem":
                                iy = iconHeight * 10;
                                break;
                        }

                        switch (card.rarity) {
                            case 0: // common
                                switch (card.theme) {
                                    case "general":
                                        ix = 0;
                                        break;
                                    case "adventure":
                                        ix = iconWidth;
                                        break;
                                    case "sci-fi":
                                        ix = iconWidth * 2;
                                        break;
                                    case "mystical":
                                        ix = iconWidth * 3;
                                        break;
                                    case "fantasy":
                                        ix = iconWidth * 4;
                                        break;
                                    case "superhero":
                                        ix = iconWidth * 5;
                                        break;
                                }
                                break;
                            case 1:
                                iy += iconHeight;
                                ix = 0;
                                break;
                            case 2:
                                iy += iconHeight;
                                ix = iconWidth;
                                break;
                            case 3:
                                iy += iconHeight;
                                ix = iconWidth * 2;
                                break;
                        }

                        iz = iconWidth;
                        iw = iconHeight;

                        // Get the overlay.
                        const overlayWidth = 305;
                        const overlayHeight = 418;

                        let ox, oy, oz, ow;

                        oy = 0;

                        switch (card.character_type) {
                            case undefined:
                                ox = overlayWidth;
                                break;
                            default:
                                ox = 0;
                                break;
                        }

                        oz = overlayWidth;
                        ow = overlayHeight;

                        // Card theme icons.
                        const themeIconWidth = 36;
                        const themeIconHeight = 24;

                        let tx, ty, tz, tw;

                        ty = 0;

                        switch (card.theme) {
                            case "general":
                                tx = 0;
                                break;
                            case "adventure":
                                tx = themeIconWidth;
                                break;
                            case "sci-fi":
                                tx = themeIconWidth * 2;
                                break;
                            case "mystical":
                                tx = themeIconWidth * 3;
                                break;
                            case "fantasy":
                                tx = themeIconWidth * 4;
                                break;
                            case "superhero":
                                tx = themeIconWidth * 5;
                                break;
                            default:
                                message.reply("theme not found 3");
                                return;
                        }

                        tz = themeIconWidth;
                        tw = themeIconHeight;

                        // Crystal things.
                        const crystalSheet = {
                            x: 0,
                            y: 24,
                            width: 180,
                            height: 76 // 36 + 4 + 36
                        };

                        const crystalWidth = 36;
                        const crystalHeight = 36;

                        let cx, cy, cz, cw;

                        cy = crystalSheet.y;

                        switch (card.rarity) {
                            case 0: // common
                                switch (card.theme) {
                                    case "general":
                                        cx = 0;
                                        break;
                                    case "adventure":
                                        cx = crystalWidth;
                                        break;
                                    case "sci-fi":
                                        cx = crystalWidth * 2;
                                        break;
                                    case "mystical":
                                        cx = crystalWidth * 3;
                                        break;
                                    case "fantasy":
                                        cx = crystalWidth * 4;
                                        break;
                                    case "superhero":
                                        cx = crystalWidth * 5;
                                        break;
                                    default:
                                        message.reply("theme not found 4");
                                        return;
                                }
                                break;
                            case 1:
                                cy += crystalHeight + 4;
                                cx = 17;
                                break;
                            case 2:
                                cy += crystalHeight + 4;
                                cx = 34 + crystalWidth;
                                break;
                            case 3:
                                cy += crystalHeight + 4;
                                cx = 34 + crystalWidth * 2;
                                break;
                            default:
                                message.reply("rarity not found");
                                return;
                        }

                        cz = crystalWidth;
                        cw = crystalHeight;

                        if (card.rarity === 3) {
                            cz += 17;
                        }
                        /* --- end of old code --- */

                        // Make the image.
                        const bgWidth = 455;
                        const bgHeight = 630;

                        // image overlaying stuff.
                        let bg = await new jimp(800, 1200);
                        let cardArt = await jimp.read(path.join(__dirname, '../assets/cards/art/', commandValues.matchedCards.image + ".jpg"));
                        let frameOverlay = frameOverlays
                            .clone()
                            .crop(ox, oy, oz, ow)
                            .resize(bgWidth, bgHeight);
                        let frameOutline = frameOutlines
                            .clone()
                            .crop(x, y, z, w)
                            .resize(bgWidth, bgHeight);
                        let typeIcon = typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
                        let themeIcon = miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
                        let crystal = miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

                        let frameTop;
                        if (fy !== undefined) {
                            frameTop = frameTops
                                .clone()
                                .crop(fx, fy, fz, fw)
                                .resize(bgWidth + 49, 200);
                        }

                        bg.composite(
                            cardArt,
                            bg.bitmap.width / 2 - cardArt.bitmap.width / 2,
                            bg.bitmap.height / 2 - cardArt.bitmap.height / 2
                        );
                        bg.composite(
                            frameOverlay,
                            bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2,
                            bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2
                        );
                        bg.composite(
                            frameOutline,
                            bg.bitmap.width / 2 - frameOutline.bitmap.width / 2,
                            bg.bitmap.height / 2 - frameOutline.bitmap.height / 2
                        );

                        if (fy !== undefined) {
                            bg.composite(
                                frameTop,
                                bg.bitmap.width / 2 - frameTop.bitmap.width / 2 - 8,
                                240
                            );
                        }

                        bg.composite(typeIcon, 130, 182);
                        bg.composite(
                            themeIcon,
                            bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168,
                            843
                        );

                        // 3 = legendary
                        let xoffset = 0;
                        if (card.rarity === 3) {
                            xoffset = 25;
                        }

                        bg.composite(
                            crystal,
                            bg.bitmap.width / 2 - themeIcon.bitmap.width / 2 - 168 - xoffset,
                            745
                        );

                        if (card.name instanceof Array) {
                            printCenter(bg, sp25Font, 20, 315, card.name[0]);
                        } else {
                            printCenter(bg, sp25Font, 20, 315, card.name);
                        }

                        printCenter(bg, sp60Font, -168, 350, card.mana_cost.toString());

                        if (ox === 0) {
                            printCenter(bg, sp27Font, -168, 515, stats.health.toString());
                            printCenter(bg, sp27Font, -168, 640, stats.damage.toString());
                        }

                        printCenter(bg, sp16Font, 17, 358, level === null ? `u ${upgrade}` : `lvl ${level}`);

                        printCenterCenter(bg, sp18Font, 20, 510, card.description, 325);

                        //bg.autocrop(0.002, false);
                        bg.crop(135, 165, 526, 769);

                        // save + post
                        const saveDate = Date.now();

                        bg.write(path.join(__dirname, "temp", `pd-${saveDate}.png`), async () => {

                            //const x = "https://sppd.feinwaru.com/backgrounds/" + card.image + ".jpg"
                            //await message.channel.send({
                            //files: [x]
                            //})


                            const embed = new discord.RichEmbed();

                            // card name
                            if (cardData.name instanceof Array) {

                                embed.setAuthor(cardData.name[0]);
                            } else {

                                embed.setAuthor(cardData.name);
                            }

                            let embedColour = null;
                            switch (cardData.theme) {
                                case "adventure":
                                    embedColour = "#4f80ba";
                                    break;
                                case "fantasy":
                                    embedColour = "#d34f5f";
                                    break;
                                case "sci-fi":
                                    embedColour = "#db571d";
                                    break;
                                case "mystical":
                                    embedColour = "#4b9b38";
                                    break;
                                case "superhero":
                                    embedColour = "#fd6cf8";
                                    break;
                                case "general":
                                    embedColour = "#857468";
                                    break;
                                default:
                                    embedColour = "#857468";
                            }
                            embed.setColor(embedColour);

                            embed.setDescription("");

                            embed.description += "**General Information**\n";
                            if (cardData.cast_area === "own_side") {
                                embed.description += `Cast Area: Own Side\n`;
                            } else {
                                embed.description += `Cast Area: ${cardData.cast_area}\n`;
                            }
                            if (cardData.character_type !== "totem") {

                                embed.description += `Max Speed: ${Math.round(cardData.max_velocity * 100) / 100}\n`;
                                embed.description += `Time To Reach Max Speed: ${Math.round(cardData.time_to_reach_max_velocity * 100) / 100}\n`;
                                embed.description += `Agro Range Multiplier: ${Math.round(cardData.agro_range_multiplier * 100) / 100}\n\n`;
                            } else {

                                embed.description += "\n";
                            }

                            let hasPower = false;
                            if (cardData.powers.length !== 0) {
                                hasPower = true
                            }

                            // enforcer jimmy aura range
                            if (hasPower || cardData.name === "Enforcer Jimmy") {

                                embed.description += "**Power Information? - Yes**\n";

                                for (let field in stats) {

                                    if (field === "PowerRange" && stats[field] === 0) {

                                        continue;
                                    }

                                    if (field.startsWith("Power")) {

                                        embed.description += `${field === "PowerRange" ? field : camelPad(field.slice(5, field.length))}: ${typeof stats[field] === "number" ? Math.round(stats[field] * 100) / 100 : stats[field]}\n`;
                                    }
                                }

                                if ( /*card.ChargedPowerRadius !== 0 && */ cardData.powers[0].charged_regen !== 0) {

                                    embed.description += `Charged Power Regen: ${Math.round(cardData.powers[0].charged_regen * 100) / 100}\n\n`;
                                } else {

                                    embed.description += "\n";
                                }

                            } else {

                                embed.description += "**Power Information? - No**\n\n";
                            }

                            if (cardData.type === "character" && cardData.can_attack && cardData.character_type !== "totem") {
                                // card that can attack

                                embed.description += "**Can Attack? - Yes**\n";

                                embed.description += `Attack Range: ${Math.round(cardData.attack_range * 100) / 100}\n`;
                                embed.description += `Knockback: ${Math.round(parseInt(cardData.knockback) * 100) / 100} at ${Math.round(cardData.knockback_angle * 100) / 100}°\n\n`;

                            } else {
                                // spell, totem or card that cant attack

                                embed.description += "**Can Attack? - No**\n\n";
                            }

                            if (cardData.has_aoe && cardData.type !== "spell") {
                                // aoe attacks

                                embed.description += "**AOE Attacks? - Yes**\n";

                                embed.description += `AOE damage Percentage: ${Math.round(cardData.aoe_damage_percentage * 100) / 100}\n`;
                                embed.description += `AOE Knockback Percentage: ${Math.round(cardData.aoe_knockback_percentage * 100) / 100}\n`;
                                embed.description += `AOE Radius: ${Math.round(cardData.aoe_radius * 100) / 100}\n\n`;

                            } else {
                                // no aoe

                                embed.description += "**AOE Attacks? - No**\n\n";
                            }

                            embed.description += `Full Stats: https://sppd.feinwaru.com/${cardData.image}`;

                            embed.setFooter("© 2018 Copyright: Feinwaru Software ");

                            // ***ATTACK INFO***

                            // -can attack
                            // -attack range
                            // -time in between attacks
                            // -pre attack delay
                            // -knockback impulse
                            // -aoe attack type
                            // -aoe damage percentage
                            // -aoe radius
                            // -aoe knockback percentage

                            // ***POWER INFO***

                            // -targeting ...
                            // -power duration

                            // ***SPEED INFO***

                            // -time to max velocity
                            // -max velocity

                            // ***totem ONLY***

                            // -health loss

                            // ***spell ONLY***



                            // *** ??? ***

                            // -requirements ...
                            // -child unit limit

                            // *name
                            // CanAttack
                            // *description
                            // *Image
                            // -ManaCost
                            // -damage
                            // -health
                            // healthLoss - character_type: totem
                            // type - if !Character, character_type === undefined
                            // Targeting ... - power radius
                            // character_type
                            // AttackRange
                            // TimeToMaxVelocity
                            // MaxVelocity
                            // TimeInBetweenAttacks
                            // PowerDuration
                            // -PowerPower
                            // -rarity
                            // -theme
                            // Requirements
                            // AOEAttacktype
                            // AOEdamagePercentage
                            // AOERadius
                            // AOEKnockbackPercentage
                            // PreAttackDelay
                            // CastArea - ownside/anywhere
                            // ChildUnitLimit

                            await message.channel.send("", {
                                file: path.join(__dirname, "temp", `pd-${saveDate}.png`)
                            });
                            message.channel.send(embed)
                            fs.unlink(path.join(__dirname, "temp", `pd-${saveDate}.png`), error => {
                                if (error !== null && error !== undefined) {

                                    throw `could not delete: pd-${saveDate}.png`;
                                }
                            });
                        });

                    })
                    .catch(error => {
                        console.error(error)
                        const discordEmbed = new discord.RichEmbed()
                            .setColor('#F8534F')
                            .setTitle(":x: Error. Its gay 1");
                        message.channel.send(discordEmbed);
                    });
            })
            .catch(error => {
                console.error(error)
                const discordEmbed = new discord.RichEmbed()
                    .setColor('#F8534F')
                    .setTitle(":x: Error. Its gay 2");
                message.channel.send(discordEmbed);
            });

    },

    load: function () {
        return new Promise((resolve, reject) => {

            const promises = [];

            promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-16.fnt"))
                .then(font => {
                    sp16Font = font;
                }));
            promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-18.fnt"))
                .then(font => {
                    sp18Font = font;
                }));
            promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-25.fnt"))
                .then(font => {
                    sp25Font = font;
                }));
            promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-27.fnt"))
                .then(font => {
                    sp27Font = font;
                }));
            promises.push(jimp.loadFont(path.join(__dirname, "..", "assets", "cards", "fonts", "SP-60.fnt"))
                .then(font => {
                    sp60Font = font;
                }));

            promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-overlay.png"))
                .then(image => {
                    frameOverlays = image;
                }));
            promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-outline.png"))
                .then(image => {
                    frameOutlines = image;
                }));
            promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "frame-top.png"))
                .then(image => {
                    frameTops = image;
                }));
            promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "card-character-type-icons.png"))
                .then(image => {
                    typeIcons = image;
                }));
            promises.push(jimp.read(path.join(__dirname, "..", "assets", "cards", "templates", "card-theme-icons.png"))
                .then(image => {
                    miscIcons = image;
                }));

            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
});




module.exports = card;