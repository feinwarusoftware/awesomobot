"use strict";

const discord = require("discord.js");

const config = require("../config.json");

const client = new discord.Client();
client.login(config.token);

module.exports = client;
