"use strict";

const path = require("path");
const { fork } = require("child_process");

//const envs = ["dev", "prod"];
const modules = ["bot", "web"];

const env = (process.env.ENV || "dev").toLowerCase();
if (env.includes(env) === false) return;

if (env === "dev") {

  modules.forEach(e => require(path.join(__dirname, "src", e)));
}

if (env === "prod") {

  modules.forEach(e => fork(path.join(__dirname, "src", e)));
}

console.log(`launched all modules in ${env.toUpperCase()} mode`);
