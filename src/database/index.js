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

        return BotLogSchema.find(type === null ? {} : { type }).sort({ time: -1 }).limit(count);
    }
    addBotLog(message, type) {

        const botLog = new BotLogSchema({

            type,
            message
        });

        return this._saveDoc(botLog);
    }

    getGuildLogs(objectId, count = 50, type = null) {

        return BotLogSchema.find(type === null ? { _id: objectId } : { _id: objectId, type }).sort({ time: -1 }).limit(count);
    }
    addGuildLog(objectId, message, type) {

        const guildLog = new GuildLogSchema({

            guild: objectId,
            type,
            message
        });

        return this._saveDoc(guildLog);
    }

    getGuildByDiscordId(discordId) {

        return new Promise((resolve, reject) => {

            GuildSchema.findOne({ discordId }, (err, guild) => {
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

            GuildSchema.findById(objectId, (err, guild) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(guild);
            });
        });
    }
    saveGuild(guild) {

        return this._saveDoc(guild);
    }
    addGuild(discordId, premium, prefix, errorChannelId, logChannelId, logEvents, scripts) {

        const guild = new GuildSchema({

            discordId,
            premium,
            prefix,
            errorChannelId,
            logChannelId,
            logEvents,
            scripts
        });

        return this._saveDoc(guild);
    }

    getUserByDiscordId(discordId) {

        return new Promise((resolve, reject) => {

            UserSchema.findOne({ discordId }, (err, user) => {
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

            UserSchema.findById(objectId, (err, user) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        });
    }
    saveUser(user) {

        return this._saveDoc(user);
    }
    addUser(discordId, scripts = []) {

        const user = new UserSchema({

            discordId,
            scripts
        });

        return this._saveDoc(user);
    }

    getScriptsByObjectIdArray(ObjectIds) {

        return new Promise((resolve, reject) => {

            ScriptSchema.find({ _id: { $in: objectIds } }, (err, scripts) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(scripts);
            });
        });
    }
    getScriptByObjectId(ObjectId) {

        return new Promise((resolve, reject) => {

            ScriptSchema.findById(ObjectId, (err, script) => {
                if (err !== undefined && err !== null) {
                    reject(err);
                    return;
                }
                resolve(script);
            });
        });
    }
    saveScript(script) {

        return this._saveDoc(script);
    }
    addScript(author, name, description, type, permissions, dependencies, code) {

        const script = new ScriptSchema({

            author,
            name,
            description,
            type,
            permissions,
            dependencies,
            code
        });

        return this._saveDoc(script);
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
