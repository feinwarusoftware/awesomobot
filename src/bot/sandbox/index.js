"use strict";

const vm = require("vm");

const babel = require("babel-core");

const Logger = require("../../logger");
const loopTimeout = require("./plugins/loop_timeout");

const sbLogger = new Logger();

// NOTE: Currently, loops will time out at 2000 ms regardless of value passed into the constructor.

class Sandbox {
    constructor(base, timeout) {

        this.base = base;
        this.timeout = timeout;
    }
    exec(code, sandbox) {

        let out;
        try {

            out = babel.transform(code, {
                plugins: [ loopTimeout ]
            });
        } catch(err) {

            sbLogger.fatalError(`error running loop timeout sandbox transform: ${err}`);
        }

        let script = new vm.Script(out.code);

        sandbox = { ...JSON.parse(JSON.stringify(this.base)), ...sandbox };

        try {

            script.runInThisContext(sandbox, { timeout: this.timeout });
        } catch(err) {

            sbLogger.fatalError(`error running sandbox code: ${err}`);
        }
    }
}

module.exports = Sandbox;
