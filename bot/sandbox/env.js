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
            
            base = vm.createContext(message.base);
            timeout = message.timeout;

            break;
        case "script":
            console.log(`running script`);

            let code;
            let script;
            let sandbox;

            if (message.id !== null) {

                console.error("cached scripts not implemented yet");
                return;

            } else {

                let out;
                try {

                    out = babel.transform(message.code, {
                        plugins: [loopTimeout]
                    });
                } catch(err) {

                    console.error(`babel error: ${err}`);
                    return;
                }
                code = out.code;

                script = new vm.Script(code);
            }

            sandbox = {...JSON.parse(JSON.stringify(base)), ...message.sandbox};

            try {

                script.runInThisContext(sandbox, { timeout });

            } catch(err) {

                console.error(`vm error: ${err}`);
                return;
            }
            break;
        default:
            console.error("unknown message type");
            break;
    }
});

console.log("sandbox started");
