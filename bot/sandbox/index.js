"use strict";

const { fork } = require("child_process");
const path = require("path");

class Sandbox {
    constructor(id, base = {}, timeout = 2000) {

        this.id = id;
        this.base = base;
        this.timeout = timeout;

        this.childProcess = fork(path.join(__dirname, "env.js"), ["--inspect"], { silent: true });
        this.childProcess.stdout.on("data", data => {
            console.log(`cp-${id}: ${data}`);
        });
        this.childProcess.stderr.on("data", data => {
            console.log(`cp-${id}: ${data}`);
        });
        this.childProcess.on("close", code => {
            console.log(`cp-${id} exited with code: ${code}`);
        });

        this.childProcess.send({ type: "config", base: this.base, timeout: this.timeout });
    }
    exec(code, sandbox) {

        this.childProcess.send({ type: "script", id: null, code, sandbox });
    }
}

module.exports = Sandbox;
