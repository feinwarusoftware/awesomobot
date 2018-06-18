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

const test = async () => {

    const db = require("./src/database");
    const mongo = new db.Database("mongotest", "mongodb://localhost/rawrxd");

    let user;
    await mongo.addUser("168690518899949569", []).then(doc => {
        user = doc;
    });

    let script;
    await mongo.addScript(user._id, "placehodler-name", "palcehodler-description", "placeholder-type", 0, [], "while(true);").then(doc => {
        script = doc;
    });

    user.scripts = [script._id];
    await mongo.saveUser(user);

    await mongo.addGuild("405129031445381120", true, "<<", null, null, [], [{ objectId: script._id }]);

    console.log("done");
}

const awesomo = new bot.Bot(cfg.bot_id, cfg.bot_token);
awesomo.start();

//test();
