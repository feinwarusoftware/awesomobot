"use strict";

const mongoose = require("mongoose");

const { guildSchema, userSchema, scriptSchema } = require("./schemas");

class Database {
    constructor(id, address) {

        this.id = id;
        this.address = address;

        mongoose.connect(address);
        mongoose.Promise = global.Promise;

        this.db = mongoose.connection;

        this.db.on("error", err => {
            console.error(`${id} - database error: ${err}`);
        });
        this.db.on("open", () => {
            console.log(`${id} - connected to database`);
        });
    }
    _save(object) {

        return new Promise((resolve, reject) => {

            object.save((err, object) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(object);
            });
        });
    }
    getUserByDiscordId(discordId) {

        return new Promise((resolve, reject) => {

            userSchema.findOne({ discordId }, (err, user) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        });
    }
    getUserByObjectId(objectId) {

        return new Promise((resolve, reject) => {

            userSchema.findById(objectId, (err, user) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        });
    }
    saveUser(user) {

        return new Promise((resolve, reject) => {

            this._save(user).then((user) => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
    getGuildByDiscordId(discordId) {

        return new Promise((resolve, reject) => {

            guildSchema.findOne({ discordId }, (err, guild) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(guild);
            });
        });
    }
    getGuildByObjectId(objectId) {

        return new Promise((resolve, reject) => {

            guildSchema.findById(objectId, (err, guild) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(guild);
            });
        });
    }
    saveGuild(guild) {

        return new Promise((resolve, reject) => {

            this._save(guild).then((user) => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
    getScriptByObjectId(objectId) {

        return new Promise((resolve, reject) => {

            scriptSchema.findById(objectId, (err, script) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(script);
            });
        });
    }
    saveScript(script) {

        return new Promise((resolve, reject) => {

            this._save(script).then((user) => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = {
 
    Database,
    guildSchema,
    userSchema,
    scriptSchema
};
