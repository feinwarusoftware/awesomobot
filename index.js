"use strict";

const db = require("./db");
const utils = require("./utils");

utils.hookStderr(write => {
    
    return function(data, encoding, cb) {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

const test = async () => {

    const mongo = new db.Database("db-test", "mongodb://localhost/rawrxd");

    const testScript = new db.scriptSchema({
        author: null,
        name: "testScript1",
        description: "a script for testing database stuff",
        type: "js",
        dependencies: [],
        permissions: [],
        event: "discord:message",
        relay: null,
        code: "while(true);"
    });

    await mongo.saveScript(testScript);

    console.log("finished");
}

console.error("***awesomo 3.0 wip*** - run 'cd old && node .' to start the old bot");

test();
