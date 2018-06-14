"use strict";

const utils = require("./utils");

utils.hookStderr(write => {
    
    return function(data, encoding, cb) {

        write.apply(process.stderr, [`\x1b[31m${data}\x1b[0m`, encoding, cb]);
    }
});

console.error("***awesomo 3.0 wip*** - run 'cd old && node .' to start the old bot");
