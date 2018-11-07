"use strict"

const path = require("path");
const fs = require("fs");

const jimp = require("jimp");

const Command = require("../command");
const utils = require("../../utils");
const print = require("../../utils/print");

const cards = require("./assets/cards.json");

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

// note, the base stats are upgrade 1
const getUpgradeStats = (currentCard, upgrade) => {
    if (upgrade < 1 || upgrade > 70) {
        console.log("oooof");
        return {};
    }
    const stats = {};
    for (let k in currentCard) {
        if (k.startsWith("Power") === true && currentCard[k] !== null && currentCard[k] !==
            "") {
            stats[k] = currentCard[k];
        }
        // exceptions cos redlynx gay
        if (k === "ChargedPowerRadius") {
            stats["PowerRange"] = currentCard[k];
        }
    }
    stats.Health = parseInt(currentCard.Health);
    if (isNaN(stats.Health)) {
        console.log("of");
        return {};
    }
    stats.Damage = parseInt(currentCard.Damage);
    if (isNaN(stats.Damage)) {
        console.log("oof");
        return {};
    }
    if (currentCard.Type === "Spell") {
        if (currentCard.Image === "SpellCockMagicCard") {
            stats["PowerTarget"] = 1;
        }
        return stats;
    }
    for (let i = 0; i < upgrade - 1; i++) {
        if (currentCard.TechTree2.Slots[i].id !== undefined) {
            stats.ability = true;
            continue;
        }
        if (currentCard.TechTree2.Slots[i].property === "MaxHealth") {
            stats.Health += currentCard.TechTree2.Slots[i].value;
        }
        if (currentCard.TechTree2.Slots[i].property === "Damage") {
            stats.Damage += currentCard.TechTree2.Slots[i].value;
        }
        if (currentCard.TechTree2.Slots[i].property.indexOf("Abs") !== -1) {
            const propertyAbs = currentCard.TechTree2.Slots[i].property;
            const property = propertyAbs.slice(0, propertyAbs.length - 3);
            if (stats[property] === undefined) {
                console.log("ooof");
                return {};
            } else {
                stats[property] += currentCard.TechTree2.Slots[i].value;
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
        for (let j = 0; j < currentCard.TechTree2.Evolve[i].Slots.length; j++) {
            if (currentCard.TechTree2.Evolve[i].Slots[j].property === "MaxHealth") {
                stats.Health += currentCard.TechTree2.Evolve[i].Slots[j].value;
            }
            if (currentCard.TechTree2.Evolve[i].Slots[j].property === "Damage") {
                stats.Damage += currentCard.TechTree2.Evolve[i].Slots[j].value;
            }
            if (currentCard.TechTree2.Evolve[i].Slots[j].property.indexOf("Abs") !== -1) {
                const propertyAbs = currentCard.TechTree2.Evolve[i].Slots[j].property;
                const property = propertyAbs.slice(0, propertyAbs.length - 3);
                if (stats[property] === undefined) {
                    console.log("ooooof");
                    return {};
                } else {
                    stats[property] += currentCard.TechTree2.Evolve[i].Slots[j].value;
                }
            }
        }
    }
    return stats;
}

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
    if (currentCard.Type === "Spell") {
        for (let i = 0; i < level - 1; i++) {
            for (let j = 0; j < currentCard.TechTree2.Evolve[i].Slots.length; j++) {
                if (currentCard.TechTree2.Evolve[i].Slots[j].property === "MaxHealth") {
                    stats.Health += currentCard.TechTree2.Evolve[i].Slots[j].value;
                }
                if (currentCard.TechTree2.Evolve[i].Slots[j].property === "Damage") {
                    stats.Damage += currentCard.TechTree2.Evolve[i].Slots[j].value;
                }
                if (currentCard.TechTree2.Evolve[i].Slots[j].property.indexOf("Abs") !== -1) {
                    const propertyAbs = currentCard.TechTree2.Evolve[i].Slots[j].property;
                    const property = propertyAbs.slice(0, propertyAbs.length - 3);
                    if (stats[property] === undefined) {
                        console.log("ooooof");
                        return {};
                    } else {
                        stats[property] += currentCard.TechTree2.Evolve[i].Slots[j].value;
                    }
                }
            }
        }
    } else {
        const currentLevel = currentCard.TechTree2.Evolve[level - 2]
        for (let i = 0; i < currentLevel.Slots.length; i++) {
            if (currentLevel.Slots[i].property === "MaxHealth") {
                stats.Health += currentLevel.Slots[i].value;
            }
            if (currentLevel.Slots[i].property === "Damage") {
                stats.Damage += currentLevel.Slots[i].value;
            }
            if (currentLevel.Slots[i].property.indexOf("Abs") !== -1) {
                const propertyAbs = currentLevel.Slots[i].property;
                const property = propertyAbs.slice(0, propertyAbs.length - 3);
                if (stats[property] === undefined || property === "PowerTarget") {
                    if (property === "PowerTarget") {
                        stats[property] = level;
                    } else {
                        console.log("ooooooof");
                        return {};
                    }
                } else {
                    stats[property] += currentLevel.Slots[i].value;
                }
            }
        }
    }
    return stats;
}

const card = new Command({

    name: "card",
    description: "View any card from phone destroyer, rendered in real time with full stats!",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099660711821312/card.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "card",

    featured: false,

    preload: true,

    cb: async function (client, message, guild, user, script, match) {

        // deep copy cards so we can replace shit without worrying about gay object shit
        const cardsCopy = JSON.parse(JSON.stringify(cards));

        // legacy command support

        // card <name>
        // card <name> <level>
        // card <name> l<level>
        // card <name> u<upgrade>

        let name = null;

        let level = null;
        let upgrade = null;

        // 5 = card(4) + space(1).
        const args = message.content.slice(guild.prefix.length + 5);
        if (args === "") {

            return message.reply(`usage: ${guild.prefix}card <name> (l)[level=1]/u[upgrade]`);
        }

        const split = args.split(" ");
        const last = split[split.length - 1];

        // assume level/upgrade is set, and if not, reset this value later
        name = split.slice(0, split.length - 1).join(" ");

        if (last.startsWith("l")) {

            level = parseInt(last.slice(1));

            if (isNaN(level)) {

                return message.reply("level not set correctly");
            }

            if (level < 1 || level > 7) {

                return message.reply("level out of bounds");
            }
        }
        if (last.startsWith("u")) {

            upgrade = parseInt(last.slice(1));

            if (isNaN(upgrade)) {

                return message.reply("upgrade not set correctly");
            }

            if (upgrade < 1 || upgrade > 70) {

                return message.reply("upgrade out of bounds");
            }
        }

        // default to level checking for last param
        if (level === null && upgrade === null) {

            level = parseInt(last);

            // default to 1
            if (isNaN(level)) {

                level = 1;
                name = split.join(" ");
            }

            // make sure the last word isnt a number by coincidence
            // this will not work if the last word is a number between 1 and 7
            if (level < 1 || level > 7) {

                level = 1;
                name = split.join(" ");
            }
        }

        // find the card by % match

        const threshold = 0.0;

        let index = null;
        let current = threshold;

        for (let [i, v] of cardsCopy.entries()) {

            let similarity = null;

            if (v.Name instanceof Array) {

                for (let vname of v.Name) {

                    similarity = utils.similarity(vname, name);

                    if (similarity > current) {

                        current = similarity;
                        index = i;
                    }
                }
            } else {

                similarity = utils.similarity(v.Name, name);

                if (similarity > current) {

                    current = similarity;
                    index = i;
                }
            }
        }

        if (index === null) {

            return message.reply("card not found");
        }

        const card = cardsCopy[index];

        let stats = null;
        if (level === null) {

            stats = getUpgradeStats(card, upgrade);
        } else {

            stats = getLevelStats(card, level);
        }

        for (let stat in stats) {

            if (stat === "Damage" || stat == "Health") {

                continue;
            }

            if (stat === "PowerMaxHPGain") {

                card.Description = card.Description.replace(`{PowerMaxHealthBoost}`, stats[stat]);
                continue;
            }

            card.Description = card.Description.replace(`{${stat}}`, stats[stat]);
        }

        if (card.Description.includes("{PowerDurationMin}-{PowerDurationMax}")) {

            card.Description = card.Description.replace("{PowerDurationMin}-{PowerDurationMax}", `${card.PowerDuration - 1}-${card.PowerDuration + 1} seconds`);
        }
        if (card.Name === "Cock Magic") {

            card.Description = card.Description.replace("{PowerTargetAmount}", level);
        }
        if (card.Name === "Marcus") {

            card.Description = card.Description.replace("{PowerHeroDamage}", card.PowerDamage);
        }
        if (card.Name === "Marine Craig") {

            card.Description = card.Description.replace("{PowerHeroPoison}", card.PowerPoisonAmount);
        }
        if (card.Name === "Chicken Coop") {

            card.Description = card.Description.replace("{PowerInterval.1}", "3.5");
        }
        if (card.Name === "Shieldmaiden Wendy") {

            card.Description = card.Description.slice(0, card.Description.length - 1) + " seconds.";
        }
        if (card.Name === "Youth Pastor Craig") {

            card.Description = card.Description.slice(0, card.Description.length - 1) + " seconds.";
        }

        /* --- pasted old code --- */

        // Get the frame outline.
        const frameWidth = 305;
        const frameHeight = 418;

        let x, y, z, w;

        switch (card.Rarity) {
            case 0: // common
                y = 0;
                switch (card.Theme) {
                    case "Adv":
                        x = frameWidth;
                        break;
                    case "Sci":
                        x = frameWidth * 2;
                        break;
                    case "Mys":
                        x = frameWidth * 3;
                        break;
                    case "Fan":
                        x = frameWidth * 4;
                        break;
                    case "Gen":
                        x = 0;
                        break;
                    default:
                        message.reply("theme not found");
                        return;
                        break;
                }
                break;
            default:
                y = frameHeight;
                switch (card.Theme) {
                    case "Adv":
                        x = frameWidth;
                        break;
                    case "Sci":
                        x = frameWidth * 2;
                        break;
                    case "Mys":
                        x = frameWidth * 3;
                        break;
                    case "Fan":
                        x = frameWidth * 4;
                        break;
                    case "Gen":
                        x = 0;
                        break;
                    default:
                        message.reply("theme not found");
                        return;
                        break;
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

        switch (card.Rarity) {
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
                break;
        }

        fz = topWidth;
        fw = topHeight;

        // Get the icon.
        const iconWidth = 116;
        const iconHeight = 106;

        let ix, iy, iz, iw;

        switch (card.CharacterType) {
            case "Tank":
                iy = 0;
                break;
            case undefined:
                iy = iconHeight * 2;
                break;
            case "Assassin":
                iy = iconHeight * 4;
                break;
            case "Ranged":
                iy = iconHeight * 6;
                break;
            case "Melee":
                iy = iconHeight * 8;
                break;
            case "Totem":
                iy = iconHeight * 10;
                break;
        }

        switch (card.Rarity) {
            case 0: // common
                switch (card.Theme) {
                    case "Gen":
                        ix = 0;
                        break;
                    case "Adv":
                        ix = iconWidth;
                        break;
                    case "Sci":
                        ix = iconWidth * 2;
                        break;
                    case "Mys":
                        ix = iconWidth * 3;
                        break;
                    case "Fan":
                        ix = iconWidth * 4;
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

        switch (card.CharacterType) {
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

        switch (card.Theme) {
            case "Gen":
                tx = 0;
                break;
            case "Adv":
                tx = themeIconWidth;
                break;
            case "Sci":
                tx = themeIconWidth * 2;
                break;
            case "Mys":
                tx = themeIconWidth * 3;
                break;
            case "Fan":
                tx = themeIconWidth * 4;
                break;
            default:
                message.reply("theme not found");
                return;
                break;
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

        switch (card.Rarity) {
            case 0: // common
                switch (card.Theme) {
                    case "Gen":
                        cx = 0;
                        break;
                    case "Adv":
                        cx = crystalWidth;
                        break;
                    case "Sci":
                        cx = crystalWidth * 2;
                        break;
                    case "Mys":
                        cx = crystalWidth * 3;
                        break;
                    case "Fan":
                        cx = crystalWidth * 4;
                        break;
                    default:
                        message.reply("theme not found");
                        return;
                        break;
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
                break;
        }

        cz = crystalWidth;
        cw = crystalHeight;

        if (card.Rarity === 3) {
            cz += 17;
        }
        /* --- end of old code --- */

        // Make the image.
        const bgWidth = 455;
        const bgHeight = 630;

        // image overlaying stuff.
        let bg = await new jimp(800, 1200);
        let cardArt = await jimp.read(path.join(__dirname, "assets", "art", "cards", card.Image + ".jpg"));
        let frameOverlay = frameOverlays.clone().crop(ox, oy, oz, ow).resize(bgWidth, bgHeight);
        let frameOutline = frameOutlines.clone().crop(x, y, z, w).resize(bgWidth, bgHeight);
        let typeIcon = typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
        let themeIcon = miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
        let crystal = miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

        let frameTop;
        if (fy !== undefined) {
            frameTop = frameTops.clone().crop(fx, fy, fz, fw).resize(bgWidth + 49, 200);
        }

        bg.composite(cardArt, bg.bitmap.width / 2 - cardArt.bitmap.width / 2, bg.bitmap.height / 2 - cardArt.bitmap.height / 2);
        bg.composite(frameOverlay, bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2, bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2);
        bg.composite(frameOutline, bg.bitmap.width / 2 - frameOutline.bitmap.width / 2, bg.bitmap.height / 2 - frameOutline.bitmap.height / 2);

        if (fy !== undefined) {
            bg.composite(frameTop, (bg.bitmap.width / 2 - frameTop.bitmap.width / 2) - 8, 240);
        }

        bg.composite(typeIcon, 130, 182);
        bg.composite(themeIcon, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168, 843);

        // 3 = legendary
        let xoffset = 0;
        if (card.Rarity === 3) {
            xoffset = 25;
        }

        bg.composite(crystal, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168 - xoffset, 745);

        if (card.Name instanceof Array) {
            print.printCenter(bg, sp25Font, 20, 315, card.Name[0]);
        } else {
            print.printCenter(bg, sp25Font, 20, 315, card.Name);
        }

        print.printCenter(bg, sp60Font, -168, 350, card.ManaCost.toString());

        if (ox === 0) {
            print.printCenter(bg, sp27Font, -168, 515, stats.Health.toString());
            print.printCenter(bg, sp27Font, -168, 640, stats.Damage.toString());
        }

        print.printCenter(bg, sp16Font, 17, 358, level === null ? `u ${upgrade}` : `lvl ${level}`);

        print.printCenterCenter(bg, sp18Font, 20, 510, card.Description, 325);

        bg.autocrop(0.002, false);

        // save + post
        const saveDate = Date.now();

        bg.write(path.join(__dirname, "temp", `pd-${saveDate}.png`), async () => {

            await message.channel.send("", {
                file: path.join(__dirname, "temp", `pd-${saveDate}.png`)
            })

            fs.unlink(path.join(__dirname, "temp", `pd-${saveDate}.png`), error => {
                if (error !== null && error !== undefined) {

                    throw `could not delete: pd-${saveDate}.png`;
                }
            });
        });
    },

    load: function () {
        return new Promise(async (resolve, reject) => {

            sp16Font = await jimp.loadFont(path.join(__dirname, "assets", "art", "fonts", "SP-16.fnt"));
            sp18Font = await jimp.loadFont(path.join(__dirname, "assets", "art", "fonts", "SP-18.fnt"));
            sp25Font = await jimp.loadFont(path.join(__dirname, "assets", "art", "fonts", "SP-25.fnt"));
            sp27Font = await jimp.loadFont(path.join(__dirname, "assets", "art", "fonts", "SP-27.fnt"));
            sp60Font = await jimp.loadFont(path.join(__dirname, "assets", "art", "fonts", "SP-60.fnt"));

            frameOverlays = await jimp.read(path.join(__dirname, "assets", "art", "templates", "frame-overlay.png"));
            frameOutlines = await jimp.read(path.join(__dirname, "assets", "art", "templates", "frame-outline.png"));
            frameTops = await jimp.read(path.join(__dirname, "assets", "art", "templates", "frame-top.png"));
            typeIcons = await jimp.read(path.join(__dirname, "assets", "art", "templates", "card-character-type-icons.png"));
            miscIcons = await jimp.read(path.join(__dirname, "assets", "art", "templates", "card-theme-icons.png"));

            resolve();
        });
    }
});

/*
const discord = require("discord.js");
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const print = require("../../utils/print");
const utils = require("../../utils");
const Command = require("../command");
const jimpAssets = require("../../utils/jimpload");

let loaded = false;
const loadShit = async () => {

    await jimpAssets.loadAssets();
    loaded = true;
}

loadShit();

const timeout = ms => new Promise(res => setTimeout(res, ms));

let cardSending = false;

const card = new Command("card", "phone destroyer", "js", 0, "card", "command", 0, false, null, async function (client, message, guildDoc) {
    
    while (loaded === false) {
        await timeout(200);
    }

    let cardName = message.content.substring(message.content.split(" ")[0].length + 1);

    let cardLevel = parseInt(message.content[message.content.length - 1]);
    if (isNaN(cardLevel) || cardLevel < 1 || cardLevel > 7) {
        cardLevel = 1;
    } else {
        cardName = cardName.substring(0, cardName.length - 2);
    }

    let jsonContent = fs.readFileSync(path.join(__dirname, "assets", "cards.json"));

    let cardObject;
    try {
        cardObject = JSON.parse(jsonContent);
    } catch (error) {
        message.reply(error);
        return;
    }

    const threshold = 0.0;

    let index;
    let current = threshold;

    for (let i = 0; i < cardObject.length; i++) {

        let similarity;

        if (cardObject[i].name.constructor === Array) {

            for (let j = 0; j < cardObject[i].name.length; j++) {

                similarity = utils.similarity(cardObject[i].name[j].toLowerCase(), cardName.toLowerCase());

                if (similarity > current) {

                    current = similarity;
                    index = i;
                }
            }

        } else {

            similarity = utils.similarity(cardObject[i].name.toLowerCase(), cardName.toLowerCase());
        }

        //let similarity = utils.similarity(cardObject[i].name.toLowerCase(), cardName.toLowerCase());

        if (similarity > current) {

            current = similarity;
            index = i;
        }
    }
    if (index === undefined) {
        message.reply("card not found");
        return;
    }

    let card = cardObject[index];

    // Get the frame outline.
    const frameWidth = 305;
    const frameHeight = 418;

    let x, y, z, w;

    switch (card.rarity) {
        case "Common":
            y = 0;
            switch (card.theme) {
                case "Adventure":
                    x = frameWidth;
                    break;
                case "Sci-Fi":
                    x = frameWidth * 2;
                    break;
                case "Mystical":
                    x = frameWidth * 3;
                    break;
                case "Fantasy":
                    x = frameWidth * 4;
                    break;
                case "Neutral":
                    x = 0;
                    break;
                default:
                    message.reply("theme not found");
                    return;
                    break;
            }
            break;
        default:
            y = frameHeight;
            switch (card.theme) {
                case "Adventure":
                    x = frameWidth;
                    break;
                case "Sci-Fi":
                    x = frameWidth * 2;
                    break;
                case "Mystical":
                    x = frameWidth * 3;
                    break;
                case "Fantasy":
                    x = frameWidth * 4;
                    break;
                case "Neutral":
                    x = 0;
                    break;
                default:
                    message.reply("theme not found");
                    return;
                    break;
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
        case "Common":
            fy = undefined;
            break;
        case "Rare":
            fy = 0;
            break;
        case "Epic":
            fy = topHeight;
            break;
        case "Legendary":
            fy = topHeight * 2;
            break;
        default:
            message.reply("rarity not found");
            return;
            break;
    }

    fz = topWidth;
    fw = topHeight;

    // Get the icon.
    const iconWidth = 116;
    const iconHeight = 106;

    let ix, iy, iz, iw;

    switch (card.class) {
        case "Tank":
            iy = 0;
            break;
        case "Spell":
            iy = iconHeight * 2;
            break;
        case "Assassin":
            iy = iconHeight * 4;
            break;
        case "Ranged":
            iy = iconHeight * 6;
            break;
        case "Fighter":
            iy = iconHeight * 8;
            break;
        case "Totem":
            iy = iconHeight * 10;
            break;
    }

    switch (card.rarity) {
        case "Common":
            switch (card.theme) {
                case "Neutral":
                    ix = 0;
                    break;
                case "Adventure":
                    ix = iconWidth;
                    break;
                case "Sci-Fi":
                    ix = iconWidth * 2;
                    break;
                case "Mystical":
                    ix = iconWidth * 3;
                    break;
                case "Fantasy":
                    ix = iconWidth * 4;
                    break;
            }
            break;
        case "Rare":
            iy += iconHeight;
            ix = 0;
            break;
        case "Epic":
            iy += iconHeight;
            ix = iconWidth;
            break;
        case "Legendary":
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

    switch (card.class) {
        case "Spell":
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
        case "Neutral":
            tx = 0;
            break;
        case "Adventure":
            tx = themeIconWidth;
            break;
        case "Sci-Fi":
            tx = themeIconWidth * 2;
            break;
        case "Mystical":
            tx = themeIconWidth * 3;
            break;
        case "Fantasy":
            tx = themeIconWidth * 4;
            break;
        default:
            message.reply("theme not found");
            return;
            break;
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
        case "Common":
            switch (card.theme) {
                case "Neutral":
                    cx = 0;
                    break;
                case "Adventure":
                    cx = crystalWidth;
                    break;
                case "Sci-Fi":
                    cx = crystalWidth * 2;
                    break;
                case "Mystical":
                    cx = crystalWidth * 3;
                    break;
                case "Fantasy":
                    cx = crystalWidth * 4;
                    break;
                default:
                    message.reply("theme not found");
                    return;
                    break;
            }
            break;
        case "Rare":
            cy += crystalHeight + 4;
            cx = 17;
            break;
        case "Epic":
            cy += crystalHeight + 4;
            cx = 34 + crystalWidth;
            break;
        case "Legendary":
            cy += crystalHeight + 4;
            cx = 34 + crystalWidth * 2;
            break;
        default:
            message.reply("rarity not found");
            return;
            break;
    }

    cz = crystalWidth;
    cw = crystalHeight;

    if (card.rarity === "Legendary") {
        cz += 17;
    }

    // Make the image.
    const bgWidth = 455;
    const bgHeight = 630;

    // image overlaying stuff.
    let bg = await new jimp(800, 1200);
    let cardArt = await jimp.read(path.join(__dirname, "assets", "art", "cards", card.art));
    let frameOverlay = jimpAssets.frameOverlays.clone().crop(ox, oy, oz, ow).resize(bgWidth, bgHeight);
    let frameOutline = jimpAssets.frameOutlines.clone().crop(x, y, z, w).resize(bgWidth, bgHeight);
    let typeIcon = jimpAssets.typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
    let themeIcon = jimpAssets.miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
    let crystal = jimpAssets.miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

    let frameTop;
    if (fy !== undefined) {
        frameTop = jimpAssets.frameTops.clone().crop(fx, fy, fz, fw).resize(bgWidth + 49, 200);
    }

    bg.composite(cardArt, bg.bitmap.width / 2 - cardArt.bitmap.width / 2, bg.bitmap.height / 2 - cardArt.bitmap.height / 2);
    bg.composite(frameOverlay, bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2, bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2);
    bg.composite(frameOutline, bg.bitmap.width / 2 - frameOutline.bitmap.width / 2, bg.bitmap.height / 2 - frameOutline.bitmap.height / 2);

    if (fy !== undefined) {
        bg.composite(frameTop, (bg.bitmap.width / 2 - frameTop.bitmap.width / 2) - 8, 240);
    }

    bg.composite(typeIcon, 130, 182);
    bg.composite(themeIcon, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168, 843);

    let xoffset = 0;
    if (card.rarity === "Legendary") {
        xoffset = 25;
    }

    bg.composite(crystal, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168 - xoffset, 745);

    if (card.name instanceof Array) {
        print.printCenter(bg, jimpAssets.sp25Font, 20, 315, card.name[0]);
    } else {
        print.printCenter(bg, jimpAssets.sp25Font, 20, 315, card.name);
    }

    print.printCenter(bg, jimpAssets.sp60Font, -168, 350, card.energy.toString());

    if (ox === 0) {
        print.printCenter(bg, jimpAssets.sp27Font, -168, 515, card.levels[cardLevel - 1].upgrades[0].health.toString());
        print.printCenter(bg, jimpAssets.sp27Font, -168, 640, card.levels[cardLevel - 1].upgrades[0].attack.toString());
    }

    print.printCenter(bg, jimpAssets.sp16Font, 17, 358, `lvl ${card.levels[cardLevel - 1].level}`);

    let levelIndex = 0;
    for (let i = cardLevel; i > 0; i--) {
        if (card.levels[i - 1] === undefined) {
            continue;
        }
        if (card.levels[i - 1].upgrades[0].ability_info === null) {
            continue;
        }
        if (card.levels[i - 1].upgrades[0].ability_info.description === null) {
            continue;
        }

        levelIndex = i - 1;
        break;
    }
    print.printCenterCenter(bg, jimpAssets.sp18Font, 20, 510, card.levels[levelIndex].upgrades[0].ability_info.description, 325);

    bg.autocrop(0.0002, false);

    while (cardSending === true) {
        await timeout(200);
    }

    cardSending = true;

    bg.write(path.join(__dirname, "assets", `temp.png`), async function () {

        await message.channel.send("", {
            file: path.join(__dirname, "assets", `temp.png`)
        });

        const embed = new discord.RichEmbed();

        if (card.name instanceof Array) {
            embed.setAuthor(card.name[0]);
        } else {
            embed.setAuthor(card.name);
        }
        embed.setDescription("");

        // Card info.
        /*
            Attack Info:
            Attack Range:
            Attack Speed:
            Pre Attack Delay:
            Time Between Attacks:
            Ability Info:
            Charge Time:
            Ability Power:
            Ability Range:
            Ability Duration: 
            Speed:
            Max Speed:
        */

// Spells
// just ability power

// Anything other than spells
// everything, but ability info only sometimes (only if ability === true)

//embed.setDescription(`some text... ${"variable goes here without the quotations"}\n for new line`);
//embed.description += `may be useful if you need to add conditional sttuff, in an if statement`;


//card.attack_info.pre_attack_delay
/*
        const removeNull = (str, check) => {
            if (check === undefined || check === null) {
                return "";
            }
            return str + check + "\n";
        }

        if (card.class !== "Spell" && card.levels[levelIndex].upgrades[0].ability_info.ability === true) {
            let tempDesc = "";

            tempDesc += removeNull("Attack Range: ", card.attack_info.attack_range);
            tempDesc += removeNull("Attack Speed: ", card.attack_info.attack_speed);
            tempDesc += removeNull("Pre Attack Delay: ", card.attack_info.pre_attack_delay);
            tempDesc += removeNull("Time Between Attacks: ", card.attack_info.time_between_delay);

            if (tempDesc !== "") {
                embed.description += `**Attack Info:**\n${tempDesc}`;
                tempDesc = "";
            }

            tempDesc += removeNull("Charge Time: ", card.levels[levelIndex].upgrades[0].ability_info.charge_time);
            tempDesc += removeNull("Ability Power: ", card.levels[levelIndex].upgrades[0].ability_info.ability_power);
            tempDesc += removeNull("Ability Range: ", card.levels[levelIndex].upgrades[0].ability_info.ability_range);
            tempDesc += removeNull("Ability Duration: ", card.levels[levelIndex].upgrades[0].ability_info.ability_duration);

            if (tempDesc !== "") {
                embed.description += `\n**Ability Info:**\n${tempDesc}`;
                tempDesc = "";
            }

            tempDesc += removeNull("Max Speed: ", card.speed_info.max_speed);

            if (tempDesc !== "") {
                embed.description += `\n**Speed Info:**\n${tempDesc}`;
                tempDesc = "";
            }
        }
        if (card.class !== "Spell" && card.levels[levelIndex].upgrades[0].ability_info.ability === false) {
            let tempDesc = "";

            tempDesc += removeNull("Attack Range: ", card.attack_info.attack_range);
            tempDesc += removeNull("Attack Speed: ", card.attack_info.attack_speed);
            tempDesc += removeNull("Pre Attack Delay: ", card.attack_info.pre_attack_delay);
            tempDesc += removeNull("Time Between Attacks: ", card.attack_info.time_between_delay);

            if (tempDesc !== "") {
                embed.description += `**Attack Info:**\n${tempDesc}`;
                tempDesc = "";
            }

            tempDesc += removeNull("Max Speed: ", card.speed_info.max_speed);

            if (tempDesc !== "") {
                embed.description += `\n**Speed Info:**\n${tempDesc}`;
                tempDesc = "";
            }
        }
        if (card.class === "Spell") {
            let tempDesc = "";

            tempDesc += removeNull("Ability Power: ", null);
            tempDesc += removeNull("Ability Range: ", null);
            tempDesc += removeNull("Ability Duration: ", null);

            if (tempDesc !== "") {
                embed.description += `**Ability Info:**\n${tempDesc}`;
                tempDesc = "";
            }
        }

        // Debug info and disclaimer.
        if (card.name === "Redlynx Disclaimer") {
            embed.description += "This content is in no way approved, endorsed, sponsored, or connected to South Park Digital Studios, Ubisoft, RedLynx, or associated/affiliated entities, nor are these entities responsible for this content. This content is subject to all terms and conditions outlined by the South Park: Phone Destroyer Fan Content guidelines.";
        }

        if (message.content.split(" ")[0].substring(guildDoc.prefix.length) === "dcard") {
            embed.description += `\n**Debug info:**\ndebug-similarity: ${current}\n`;
        }

        embed.description += `\n[Redlynx Disclaimer *(temp)*](https://awesomobot.com/disclaimer) • [Card Data](https://southparkphone.gg/)`;

        switch (card.theme) {
            case "Neutral":
                embed.setColor(0x857468);
                break;
            case "Adventure":
                embed.setColor(0x4f80ba);
                break;
            case "Sci-Fi":
                embed.setColor(0xdb571d);
                break;
            case "Mystical":
                embed.setColor(0x4b9b38);
                break;
            case "Fantasy":
                embed.setColor(0xd34f5f);
                break;
            default:
                message.reply("theme not found");
                return;
                break;
        }

        await message.channel.send(embed);

        cardSending = false;
    });
});
*/

module.exports = card;