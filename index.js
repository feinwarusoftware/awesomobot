"use strict";

const { hookStderr } = require("./src/utils");

hookStderr(write => {

    return (data, encoding, cb) => {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

console.error("***AWESOM-O 3.0 WIP*** - If you're using this branch, you're fucked...");
