"use strict";

const vm = require("vm");
const babel = require("babel-core");

const { loopTimeout } = require("./plugins");

process.on("message", message => {

    console.log(`received message: ${message}`);

    switch(message.env) {
        case "prod":

            let out;
            try {
        
                out = babel.transform(message.code, {
                    plugins: [ loopTimeout ]
                });
            } catch(err) {
                console.error(err);
                return;
            }
        
            let script = new vm.Script(out.code);
        
            let sandbox = { ...JSON.parse(JSON.stringify(message.base)), ...message.sandbox };
        
            try {
        
                script.runInThisContext(sandbox, { timeout: message.timeout });
            } catch(err) {
                console.error(err);
                return;
            }
            break;
        case "dev":

            console.error(`env was '${message.env}, this code shouldnt even run :thinking:`);
            return;
            break;
        default:

            console.error(`env was '${message.env}, should be 'dev' or 'prod'`);
            return;
            break;
    }
});
