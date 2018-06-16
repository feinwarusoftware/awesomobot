"use strict";

const utils = require("./src/utils");

utils.hookStderr(write => {
    
    return function(data, encoding, cb) {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

console.error("***AWESOM-O 3.0 WIP*** - The project structure has chaned! Please go to ./cmd/<module_name> and run 'node .' to launch the appropriate module.");
