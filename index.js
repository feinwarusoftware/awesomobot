"use strict";

const db = require("./src/database");

const { hookStderr } = require("./src/utils");

hookStderr(write => {

    return (data, encoding, cb) => {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

console.error("***AWESOM-O 3.0 WIP*** - If you're using this branch, you're fucked...");

const test = async () => {

    const mongo = new db.Database("test", "mongodb://localhost/rawrxd");

    /*
    for (let i = 0; i < 100; i++) {
        await mongo.addBotLog("test2", `this is bot log: ${i}`);
        await mongo.addBotLog("test3", `this is bot log: ${i}`);
    }
    */

    console.log(await mongo.getBotLogs(5, "test2"));

    console.log("done");
}

test();
