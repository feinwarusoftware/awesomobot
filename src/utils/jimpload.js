"use strict";

const jimp = require("jimp");
const path = require("path");

const loadAssets = async () => {
    module.exports.sp16Font = await jimp.loadFont(path.join(__dirname, "..", "bot", "commands", "assets", "art", "fonts", "SP-16.fnt"));
    module.exports.sp18Font = await jimp.loadFont(path.join(__dirname, "..", "bot", "commands", "assets", "art", "fonts", "SP-18.fnt"));
    module.exports.sp25Font = await jimp.loadFont(path.join(__dirname, "..", "bot", "commands", "assets", "art", "fonts", "SP-25.fnt"));
    module.exports.sp27Font = await jimp.loadFont(path.join(__dirname, "..", "bot", "commands", "assets", "art", "fonts", "SP-27.fnt"));
    module.exports.sp60Font = await jimp.loadFont(path.join(__dirname, "..", "bot", "commands", "assets", "art", "fonts", "SP-60.fnt"));

    module.exports.frameOverlays = await jimp.read(path.join(__dirname, "..", "bot", "commands", "assets", "art", "templates", "frame-overlay.png"));
    module.exports.frameOutlines = await jimp.read(path.join(__dirname, "..", "bot", "commands", "assets", "art", "templates", "frame-outline.png"));
    module.exports.frameTops = await jimp.read(path.join(__dirname, "..", "bot", "commands", "assets", "art", "templates", "frame-top.png"));
    module.exports.typeIcons = await jimp.read(path.join(__dirname, "..", "bot", "commands", "assets", "art", "templates", "card-character-type-icons.png"));
    module.exports.miscIcons = await jimp.read(path.join(__dirname, "..", "bot", "commands", "assets", "art", "templates", "card-theme-icons.png"));
}

module.exports = {
    loadAssets
}