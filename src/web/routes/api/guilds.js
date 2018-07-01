"use strict";

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

router.post("/", authAdmin, async (req, res) => {

    // Get input.
    const discord_id = req.body.discord_id === undefined ? null : req.body.discord_id;
    const prefix = req.body.prefix === undefined ? "-" : req.body.prefix;
    const log_channel_id = req.body.log_channel_id === undefined ? null : req.body.log_channel_id;
    const log_events = req.body.log_events === undefined ? null : req.body.log_events;
    const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

    // Check discord id.
    if (discord_id === null || discord_id.length !== 18) {
        return res.json({ status: 400, message: "Bad Request", error: "Discord id not specified or incorrect" });
    }

    let old_discord_id;
    try {

        old_discord_id = await schemas.GuildSchema
            .findOne({
                discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (old_discord_id !== null) {
        return res.json({ status: 400, message: "Bad Request", error: "Duplicate discord id" });
    }

    // Check prefix.
    if (prefix !== null && (typeof prefix !== "string" || prefix.length === 0)) {
        return res.json({ status: 400, message: "Bad Request", error: "Prefix needs to be a string and cannot be 0 length" });
    }

    // Check scripts.
    if (scripts instanceof Array === false) {
        return res.json({ status: 400, message: "Bad Request", error: "Scripts should be an array" });
    }

    if (scripts.length > 0) {

        let script_ids = [];
        for (let script of scripts) {
            if (typeof script.perms.enabled !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Enabled must be either true or false" });
            }
            if (typeof script.perms.members.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.members.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let ml of script.perms.members.list) {
                if (typeof ml !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.channels.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.channels.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let cl of script.perms.channels.list) {
                if (typeof cl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.roles.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.roles.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let rl of script.perms.roles.list) {
                if (typeof rl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (script.object_id === undefined) {
                return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
            }
            try {

                script_ids.push(mongoose.Types.ObjectId(script.object_id));
            } catch(error) {
                
                return res.json({ status: 400, message: "Bad Request", error: "Invalid script id provided" });
            }
        }

        let script_docs;
        try {
    
            script_docs = await schemas.ScriptSchema
                .find({
                    _id: { $in: script_ids }
                });
        } catch(error) {
    
            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }

        if (script_docs.length !== scripts.length) {
            return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
        }
    }

    const guild = new schemas.GuildSchema({
        discord_id,
        prefix,
        log_channel_id,
        log_events,
        scripts
    });

    try {

        await guild.save();
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.get("/@me", authUser, async (req, res) => {
    
    let user_guilds;
    try {

        user_guilds = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me/guilds",
            headers: {
                "Authorization": `Bearer ${"HYrvwyjKjkkxlKWRtpf6VFaCQNYlpm"}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    let user_guild_ids = [];
    for (let user_guild of user_guilds.data) {
        if ((user_guild.permissions & 8) === 8) {
            user_guild_ids.push(user_guild.id);
        }
    }

    let user_guild_docs;
    try {

        user_guild_docs = await schemas.GuildSchema
            .find({
                discord_id: { $in: user_guild_ids }
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_guild_docs.length === 0) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds with sufficient permissions found" });
    }

    const guild_objs = user_guild_docs.map(e => {
        
        const obj = e.toObject();

        delete obj._id;
        delete obj.__v;

        for (let i = 0; i < obj.scripts.length; i++) {

            delete obj.scripts[i]._id;
            delete obj.scripts[i].__v;
        }

        return obj;
    })

    res.json(guild_objs);
});

router.route("/@me/:discord_id").get(authUser, async (req, res) => {
    
    let user_guilds;
    try {

        user_guilds = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me/guilds",
            headers: {
                "Authorization": `Bearer ${"HYrvwyjKjkkxlKWRtpf6VFaCQNYlpm"}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    let found = false;
    for (let user_guild of user_guilds.data) {
        if (((user_guild.permissions & 8) === 8) && user_guild.id === req.params.discord_id) {
            found = true;
            break;
        }
    }
    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds with sufficient permissions found" });
    }

    let user_guild_doc;
    try {

        user_guild_doc = await schemas.GuildSchema
            .findOne({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_guild_doc === null) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds with sufficient permissions found" });
    }

    const guild_obj = user_guild_doc.toObject();

    delete guild_obj._id;
    delete guild_obj.__v;

    for (let i = 0; i < guild_obj.scripts.length; i++) {

        delete guild_obj.scripts[i]._id;
        delete guild_obj.scripts[i].__v;
    }

    res.json(guild_obj);

}).patch(authUser, async (req, res) => {
    
    let user_guilds;
    try {

        user_guilds = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me/guilds",
            headers: {
                "Authorization": `Bearer ${"HYrvwyjKjkkxlKWRtpf6VFaCQNYlpm"}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    let found = false;
    for (let user_guild of user_guilds.data) {
        if (((user_guild.permissions & 8) === 8) && user_guild.id === req.params.discord_id) {
            found = true;
            break;
        }
    }
    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds with sufficient permissions found" });
    }

    const prefix = req.body.prefix === undefined ? null : req.body.prefix;
    const log_channel_id = req.body.log_channel_id === undefined ? null : req.body.log_channel_id;
    const log_events = req.body.log_events === undefined ? null : req.body.log_events;
    const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

    // Check prefix.
    if (prefix !== null && (typeof prefix !== "string" || prefix.length === 0)) {
        return res.json({ status: 400, message: "Bad Request", error: "Prefix needs to be a string and cannot be 0 length" });
    }

    // Check scripts.
    if (scripts instanceof Array === false) {
        return res.json({ status: 400, message: "Bad Request", error: "Scripts should be an array" });
    }

    if (scripts.length > 0) {

        let script_ids = [];
        for (let script of scripts) {
            if (typeof script.perms.enabled !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Enabled must be either true or false" });
            }
            if (typeof script.perms.members.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.members.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let ml of script.perms.members.list) {
                if (typeof ml !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.channels.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.channels.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let cl of script.perms.channels.list) {
                if (typeof cl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.roles.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.roles.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let rl of script.perms.roles.list) {
                if (typeof rl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (script.object_id === undefined) {
                return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
            }
            try {

                script_ids.push(mongoose.Types.ObjectId(script.object_id));
            } catch(error) {
                
                return res.json({ status: 400, message: "Bad Request", error: "Invalid script id provided" });
            }
        }

        let script_docs;
        try {
    
            script_docs = await schemas.ScriptSchema
                .find({
                    _id: { $in: script_ids }
                });
        } catch(error) {
    
            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }

        if (script_docs.length !== scripts.length) {
            return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
        }
    }

    let upd_guild;
    try {

        upd_guild = await schemas.GuildSchema
            .findOneAndUpdate({
                discord_id: req.params.discord_id
            }, {
                ...(prefix === null ? {} : { prefix }),
                ...(log_channel_id === null ? {} : { log_channel_id }),
                ...(log_events === null ? {} : { log_events }),
                ...(scripts.length === 0 ? {} : { scripts })
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (upd_guild === null) {
        return res.json({ status: 404, message: "Not Found", error: "The guild that you are trying to update could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });

}).delete(authUser, async (req, res) => {
    
    let user_guilds;
    try {

        user_guilds = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me/guilds",
            headers: {
                "Authorization": `Bearer ${"HYrvwyjKjkkxlKWRtpf6VFaCQNYlpm"}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    let found = false;
    for (let user_guild of user_guilds.data) {
        if (((user_guild.permissions & 8) === 8) && user_guild.id === req.params.discord_id) {
            found = true;
            break;
        }
    }
    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds with sufficient permissions found" });
    }

    let del_guild;
    try {

        del_guild =  await schemas.GuildSchema
            .findOneAndRemove({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (del_guild === null) {
        return res.json({ status: 404, message: "Not Found", error: "The guild that you are trying to delete could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/:discord_id").get(authAdmin, async (req, res) => {

    let user_guild_doc;
    try {

        user_guild_doc = await schemas.GuildSchema
            .findOne({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_guild_doc === null) {
        return res.json({ status: 404, message: "Not Found", error: "No guilds found" });
    }

    res.json(user_guild_doc);

}).patch(authAdmin, async (req, res) => {

    const prefix = req.body.prefix === undefined ? null : req.body.prefix;
    const log_channel_id = req.body.log_channel_id === undefined ? null : req.body.log_channel_id;
    const log_events = req.body.log_events === undefined ? null : req.body.log_events;
    const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

    // Check prefix.
    if (prefix !== null && (typeof prefix !== "string" || prefix.length === 0)) {
        return res.json({ status: 400, message: "Bad Request", error: "Prefix needs to be a string and cannot be 0 length" });
    }

    // Check scripts.
    if (scripts instanceof Array === false) {
        return res.json({ status: 400, message: "Bad Request", error: "Scripts should be an array" });
    }

    if (scripts.length > 0) {

        let script_ids = [];
        for (let script of scripts) {
            if (typeof script.perms.enabled !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Enabled must be either true or false" });
            }
            if (typeof script.perms.members.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.members.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let ml of script.perms.members.list) {
                if (typeof ml !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.channels.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.channels.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let cl of script.perms.channels.list) {
                if (typeof cl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (typeof script.perms.roles.allow_list !== "boolean") {
                return res.json({ status: 400, message: "Bad Request", error: "Allow list must be either true or false" });
            }
            if (script.perms.roles.list instanceof Array === false) {
                return res.json({ status: 400, message: "Bad Request", error: "List must be an array" });
            }
            for (let rl of script.perms.roles.list) {
                if (typeof rl !== "string") {
                    return res.json({ status: 400, message: "Bad Request", error: "List must be an array of id strings" });
                }
            }
            if (script.object_id === undefined) {
                return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
            }
            try {

                script_ids.push(mongoose.Types.ObjectId(script.object_id));
            } catch(error) {
                
                return res.json({ status: 400, message: "Bad Request", error: "Invalid script id provided" });
            }
        }
    }

    let upd_guild;
    try {

        upd_guild = await schemas.GuildSchema
            .findOneAndUpdate({
                discord_id: req.params.discord_id
            }, {
                ...(prefix === null ? {} : { prefix }),
                ...(log_channel_id === null ? {} : { log_channel_id }),
                ...(log_events === null ? {} : { log_events }),
                ...(scripts.length === 0 ? {} : { scripts })
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (upd_guild === null) {
        return res.json({ status: 404, message: "Not Found", error: "The guild that you are trying to update could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });

}).delete(authAdmin, async (req, res) => {

    let del_guild;
    try {

        del_guild =  await schemas.GuildSchema
            .findOneAndRemove({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (del_guild === null) {
        return res.json({ status: 404, message: "Not Found", error: "The guild that you are trying to delete could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });
});

module.exports = router;
