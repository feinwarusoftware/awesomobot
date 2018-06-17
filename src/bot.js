"use strict";

const path = require("path");

const discord = require("discord.js");

const db = require("./database");
const log = require("./logger");
const sb = require("./sandbox");
const utils = require("./utils");

const cfg = utils.loadJson(path.join(__dirname, "..", "config", "main.json"));

class Bot {
    constructor(id, token) {

        this.id = id;
        this.token = token;

        this.client = new discord.Client();
    }
}

module.exports = {
    
    Bot
};
