"use strict";

const timeout = ms => new Promise(res => setTimeout(res, ms));

// stdout
const defStdout = process.stdout.write;

const hookStdout = cb => {

    process.stdout.write = function(write) {

        return cb(write);
    }(process.stdout.write);
};

const unhookStdout = () => {

    process.stdout.write = defStdout;
}

// stderr
const defStderr = process.stderr.write;

const hookStderr = cb => {

    process.stderr.write = function(write) {

        return cb(write);
    }(process.stderr.write)
}

const unhookStderr = () => {

    process.stderr.write = defStderr;
}

/*
function hookStderr(callback) {

    const oldError = process.stderr.write;

    process.stderr.write = (function(write) {

        return function(string, encoding, fd) {

            write.apply(process.stderr, [`\x1b[31m${string}\x1b[0m`, encoding, fd]);
            callback(...arguments);
        }
    })(process.stderr.write);

    return function() {

        process.stderr.write = oldError;
    }
}
*/

module.exports = {

    timeout,

    hookStdout,
    unhookStdout,

    hookStderr,
    unhookStderr
}
