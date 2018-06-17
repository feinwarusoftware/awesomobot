"use strict";

const mongoose = require("mongoose");

const { BotLogSchema, GuildLogSchema, GuildSchema, ScriptSchema, UserSchema } = require("./schemas");

class Database {
    constructor(id, address) {

        this.id = id;
        this.address = address;

        mongoose.connect(address);
        mongoose.Promise = global.Promise;

        this.db = mongoose.connection;

        this.db.on("error", err => {
            console.error(`db-${this.id}: ${err}`);
        });
        this.db.on("open", () => {
            console.log(`db-${this.id}: connected to database`);
        });
    }
    _saveDoc(doc) {

        return new Promise((resolve, reject) => {

            doc.save((err, doc) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(doc);
            });
        });
    }

    getBotLogs(count = 50, type = null) {


    }
    addBotLog(type, message, time = null) {


    }

    getGuildLogs(guild, count = 50, type = null) {


    }
    addGuildLog(guild, type, message, time = null) {


    }

    getGuildByDiscordId(discordId) {


    }
    getGuildByObjectId(id) {


    }
    saveGuild(guild) {

        return this._saveDoc(guild);
    }
    addGuild(discordId, scripts = []) {


    }

    getUserByDiscordId(discordId) {


    }
    getUserByObjectId(id) {


    }
    saveUser(user) {

        return this._saveDoc(user);
    }
    addUser(discordId) {


    }

    getScriptsByObjectIdArray(ids) {


    }
    getScriptByObjectId(id) {


    }
    saveScript(script) {

        return this._saveDoc(script);
    }
    addScript(author, name, description, type, permissions, dependencies, code) {


    }
}

module.exports = {

    Database,

    BotLogSchema,
    GuildLogSchema,
    GuildSchema,
    ScriptSchema,
    UserSchema
};
