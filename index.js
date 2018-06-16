"use strict";

const db = require("./db");
const utils = require("./utils");
const bot = require("./bot");

utils.hookStderr(write => {
    
    return function(data, encoding, cb) {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

const test = async () => {

    const mongo = new db.Database("db-test", "mongodb://localhost/rawrxd");

    const testScript = new db.scriptSchema({
        author: null,
        name: "test2",
        description: "a script for testing bot stuff",
        type: "javascript",
        dependencies: [],
        permissions: [],
        event: bot.EVENTS.MESSAGE,
        relay: null,
        code: "while(true);"
    });

    await mongo.saveScript(testScript);

    console.log("finished");
}

const test2 = async () => {

    const awesomo = new bot.Bot("awesomo", "MzcyNDYyNDI4NjkwMDU1MTY5.DgXdnw.y5wKs2e_L2PYgIfn4P5eWg7dksA");

    awesomo.start();
}

console.error("***awesomo 3.0 wip*** - run 'cd old && node .' to start the old bot");

test2();

