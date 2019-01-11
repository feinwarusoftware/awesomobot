"use strict";

const discord = require("discord.js");

const config = require("../config.json");

const client = new discord.Client();
const login = client.login(config.token);

const wait = ms => new Promise((resolve, reject) => setTimeout(() => resolve(), ms));

let ready = false;

client.on("ready", () => {

    ready = true;
});

const getClient = () => {
    return new Promise(async (resolve, reject) => {

        await login;

        while(!ready) {
    
            await wait(50);
        }
    
        resolve(client);
    });
}

module.exports = {

    getClient
};
