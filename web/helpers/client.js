"use strict";

const discord = require("discord.js");

const config = require("../../../config.json");

const client = new discord.Client();
const login = client.login(config.discord_token);

// const wait = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

let ready = false;

client.on("ready", () => {

  ready = true;
});

const getClient = () => {
  return new Promise((resolve, reject) => {

    login.then(() => {

      while(!ready) {

        //await wait(50);
      }

      resolve(client);

    }).catch(error => {

      reject(error);
    });
  });
};

module.exports = {

  getClient
};
