"use strict";

const path = require("path");

const bot = require("./src/bot");
const { hookStderr, loadJson } = require("./src/utils");

const cfg = loadJson(path.join(__dirname, "config.json"));

hookStderr(write => {

    return (data, encoding, cb) => {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

console.error("***AWESOM-O 3.0 WIP*** - If you're using this branch, you're fucked...");

const awesomo = new bot.Bot(cfg.bot_id, cfg.bot_token);
awesomo.start();
