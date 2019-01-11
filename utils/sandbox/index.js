"use strict";

const { NodeVM, VMScript } = require("vm2");
const babel = require("babel-core");

const loopTimeout = require("./loop_timeout");

class Sandbox {
    constructor() {

    }
    exec(code, sandbox) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {

                let out;
                try {
        
                    out = babel.transform(code, {
                        plugins: [ loopTimeout ]
                    });
                } catch(err) {
        
                    return reject(`error running loop timeout sandbox transform: ${err}`);
                }

                let vm = new NodeVM({
                    console: "inherit",
                    sandbox
                });
        
                let script = new VMScript(out.code);
    
                try {
        
                    vm.run(script);
                    resolve();
                } catch(err) {
        
                    reject(`error running sandbox code: ${err}`);
                }
            });
        });
    }
}

module.exports = Sandbox;
