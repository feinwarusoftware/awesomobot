"use strict";

const mongoose = require("mongoose");

const Logger = require("./logger");
const config = require("../config.json");

const genLogger = new Logger();

mongoose.connect(`mongodb://${config.mongo_user === null && config.mongo_pass === null ? "" : `${config.mongo_user}:${config.mongo_pass}@`}localhost/rawrxd`, {useNewUrlParser: true, ...(config.mongo_user === null && config.mongo_pass === null ? {} : { auth: { authdb: "admin" } } ) });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", err => {
    genLogger.log("stderr", err);
});
db.on("open", () => {
    genLogger.log("stdout", "connected to db");
});

process.on("exit", code => {

    genLogger.fatalError(`process exited with code: ${code}`);
});

//
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const print = require("./utils/print");
const utils = require("./utils");
const jimpAssets = require("./utils/jimpload");

const cards = require("./bot/commands/assets/cards.json");

let loaded = false;
const loadShit = async () => {

    await jimpAssets.loadAssets();
    loaded = true;
}

loadShit();

const timeout = ms => new Promise(res => setTimeout(res, ms));

const promises = [];

const renderCard = async card => {

    return new Promise(async (resolve, reject) => {

        while (loaded === false) {
            await timeout(200);
        }

        const cardLevel = 1;

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

        //
        let bg2 = await new jimp(800, 1200);
        //

        let cardArt = await jimp.read(path.join(__dirname, "bot", "commands", "assets", "art", "cards", card.art));
        let frameOverlay = jimpAssets.frameOverlays.clone().crop(ox, oy, oz, ow).resize(bgWidth, bgHeight);
        let frameOutline = jimpAssets.frameOutlines.clone().crop(x, y, z, w).resize(bgWidth, bgHeight);
        let typeIcon = jimpAssets.typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
        let themeIcon = jimpAssets.miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
        let crystal = jimpAssets.miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

        let frameTop;
        if (fy !== undefined) {
            frameTop = jimpAssets.frameTops.clone().crop(fx, fy, fz, fw).resize(bgWidth + 49, 200);
        }

        //
        bg2.composite(cardArt, bg.bitmap.width / 2 - cardArt.bitmap.width / 2, bg.bitmap.height / 2 - cardArt.bitmap.height / 2);
        //

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

        print.printCenterCenter(bg, jimpAssets.sp18Font, 20, 510, card.levels[cardLevel - 1].upgrades[0].ability_info.description, 325);

        //bg.autocrop(0.0002, false);
        bg.crop(135, 165, 526, 769);

        bg.write(path.join(__dirname, "web", "static", "cards", "frames", `frame_${card.art.substring(0, card.art.length - 4)}.png`), async function () {

            bg2.write(path.join(__dirname, "web", "static", "cards", "backgrounds", `bg_${card.art.substring(0, card.art.length - 4)}.png`), async function () {

                console.log(`rendered pd card: ${card.art.substring(0, card.art.length - 4)}`);
                resolve();
            });
        });
    });
}

for (let card of cards) {

    if (card.art === "FathermaxiMysCard.jpg") {

        //promises.push(renderCard(card));
    }
}

Promise.all(promises).then(() => {

    console.log("rendered all pd cards");

});

//

// do stuff
try {

    require("./bot");
    require("./web");
} catch(error) {

    genLogger.fatalError(`${Date.now()} - fatal error: ${error}`);
}
