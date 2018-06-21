"use strict";

const path = require("path");
const babel = require("babel-core");
const vm = require("vm");
const { fork } = require("child_process");

const { loadConfig } = require("../utils");
const { loopTimeout } = require("./plugins");

class Sandbox {
    constructor(id, base = {}, timeout = 2000, env = "prod" /* alt: prod */) {

        this.id = id;
        this.base = vm.createContext(base);
        this.timeout = timeout;
        this.env = env;

        switch(this.env) {
            case "prod":

                this.childProcess = fork(path.join(__dirname, "env.js"), [], { silent: true });
                this.childProcess.stdout.on("data", data => {
                    console.log(`sb-${this.id}: ${data}`);
                });
                this.childProcess.stderr.on("data", data => {
                    console.log(`sb-${this.id}: ${data}`);
                });
                this.childProcess.on("close", code => {
                    console.log(`sb-${this.id} exited with code: ${code}`);
                });
                break;
            case "dev":

                this.childProcess = null;
                console.log(`sb-${this.id}: sandbox started in dev mode`);
                break;
            default:

                console.error(`sb-${this.id}: env was '${this.env}, should be 'dev' or 'prod'`);
                return;
                break;
        }
    }
    set setId(id) {

        this.id = id;
    }
    set setBase(base) {

        this.base = vm.createContext(base);
    }
    set setTimeout(timeout) {

        this.timeout = timeout;
    }
    set setEnv(env) {

        this.env = env;

        if (this.childProcess !== null) {

            this.childProcess.kill();
        }

        switch(this.env) {
            case "prod":

                this.childProcess = fork(path.join(__dirname, "env.js"), [], { silent: true });
                this.childProcess.stdout.on("data", data => {
                    console.log(`sb-${this.id}: ${data}`);
                });
                this.childProcess.stderr.on("data", data => {
                    console.log(`sb-${this.id}: ${data}`);
                });
                this.childProcess.on("close", code => {
                    console.log(`sb-${this.id} exited with code: ${code}`);
                });
                break;
            case "dev":

                this.childProcess = null;
                break;
            default:

                console.error(`sb-${this.id}: env was '${this.env}, should be 'dev' or 'prod'`);
                return;
                break;
        }
    }
    exec(code, sandbox) {

        switch(this.env) {
            case "prod":

                this.childProcess.send({ id: this.id, base: this.base, timeout: this.timeout, env: this.env, code, sandbox });
                break;
            case "dev":

                let out;
                try {

                    out = babel.transform(code, {
                        plugins: [ loopTimeout ]
                    });
                } catch(err) {
                    console.error(`sb-${this.id}: ${err}`);
                    return;
                }

                let script = new vm.Script(out.code);

                let sandbox = { ...JSON.parse(JSON.stringify(this.base)), ...sandbox };

                try {

                    script.runInThisContext(sandbox, { timeout: this.timeout });
                } catch(err) {
                    console.error(`sb-${this.id}: ${err}`);
                    return;
                }
                break;
            default:

                console.error(`sb-${this.id}: env was '${this.env}, should be 'dev' or 'prod'`);
                return;
                break;
        }
    }
}

module.exports = {

    Sandbox
};
