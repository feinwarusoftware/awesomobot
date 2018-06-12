"use strict";

const vm = require("vm");
const babel = require("babel-core");

const { loopTimeout } = require("./plugins");

let base = {};
let timeout = 2000;

process.on("message", message => {

    console.log(`received message: ${message}`);

    switch(message.type) {
        case "config":
            console.log(`configuring sandbox`);
            
            base = message.base;
            timeout = message.timeout;

            break;
        case "script":
            console.log(`running script`);

            // do stuff

            // check cache
            // exec script
            // timeout script
            // catch errors

            break;
        default:
            console.error("unknown message type");
            break;
    }
});

console.log("sandbox started");
