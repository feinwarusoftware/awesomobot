"use strict";

const express = require("express");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

const limitDef = 10;
const limitMax = 25;

const pageDef = 0;

router.route("/").get(authUser, async (req, res) => {

    const page = req.query.page === undefined ? pageDef : req.query.page;
    const local = req.query.local === undefined ? null : req.query.local === "true";
    const name = req.query.name === undefined ? null : req.query.name;
    const type = req.query.type === undefined ? null : req.query.type;
    const permissions = req.query.permissions === undefined ? null : req.query.permissions;
    const match = req.query.match === undefined ? null : req.query.match;
    const match_type = req.query.match_type === undefined ? null : req.query.match_type;

    let limit = req.query.limit === undefined ? limitDef : parseInt(req.query.limit);
    if (isNaN(limit)) {
        limit = limitDef;
    }
    if (limit > limitMax) {
        limit = limitMax;
    }

    let script_schemas;
    try {

        script_schemas = await schemas.ScriptSchema
            .find({
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(type === null ? {} : { type }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type })
            })
            .skip(page * limit)
            .limit(limit)
            .select({
                __v: 0
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    script_schemas = script_schemas.filter(e => {
        return permissions === null ? true : e.permissions & permissions;
    });

    if (script_schemas.length === 0) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    res.json(script_schemas);

}).post(authAdmin, async (req, res) => {
    
    // Get input.
    const local = req.body.local === undefined ? null : req.body.local;
    const name = req.body.name === undefined ? null : req.body.name;
    const description = req.body.description === undefined ? null : req.body.description;
    const type = req.body.type === undefined ? null : req.body.type;
    const permissions = req.body.permissions === undefined ? null : req.body.permissions;
    const match = req.body.match === undefined ? null : req.body.match;
    const match_type = req.body.match_type === undefined ? null : req.body.match_type;
    const code = req.body.code === undefined ? null : req.body.code;

    if (local === null || description === null || name === null || type === null || permissions === null || match === null) {
        return res.json({ status: 400, message: "Bad Request", error: "Not enough data specified" });
    }

    if (typeof local !== "boolean") {
        return res.json({ status: 400, message: "Bad Request", error: "Local needs to be a boolean" });
    }

    if (local === false && code === null) {
        return res.json({ status: 400, message: "Bad Request", error: "Code needs to be specified if local is set to false" });
    }

    if (type !== "js" && type !== "basic") {
        return res.json({ status: 400, message: "Bad Request", error: "Type needs to be either js or basic" });
    }

    if (isNaN(parseInt(permissions)) === true) {
        return res.json({ status: 400, message: "Bad Request", error: "Permissions needs to be a number" });
    }

    if (typeof match !== "string" || match.length === 0) {
        return res.json({ status: 400, message: "Bad Request", error: "Match cannot be 0 length" });
    }

    if (match_type !== "command" && match_type !== "startswith" && match_type !== "contains" && match_type !== "exactmatch") {
        return res.json({ status: 400, message: "Bad Request", error: "Match type needs to be either command, startswith, contains or exactmatch" });
    }

    const script = new schemas.ScriptSchema({
        local,
        name,
        description,
        type,
        permissions,
        match,
        match_type,
        code
    });

    try {

        await script.save();
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/@me").get(authUser, async (req, res) => {

    if (req.user.scripts.length === 0) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    let user_scripts;
    try {

        user_scripts = await schemas.ScriptSchema
            .find({
                _id: { $in: req.user.scripts }
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_scripts.length === 0) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    const script_objs = user_scripts.map(e => {

        const obj = e.toObject();

        delete obj.__v;

        return obj;
    });

    res.json(script_objs);

}).post(authUser, async (req, res) => {

        // Get input.
        const local = false;
        const name = req.body.name === undefined ? null : req.body.name;
        const description = req.body.description === undefined ? null : req.body.description;
        const type = req.body.type === undefined ? null : req.body.type;
        const permissions = req.body.permissions === undefined ? null : req.body.permissions;
        const match = req.body.match === undefined ? null : req.body.match;
        const match_type = req.body.match_type === undefined ? null : req.body.match_type;
        const code = req.body.code === undefined ? null : req.body.code;
    
        if (name === null || description === null || type === null || permissions === null || match === null || code === null) {
            return res.json({ status: 400, message: "Bad Request", error: "Not enough data specified" });
        }
    
        if (type !== "js" && type !== "basic") {
            return res.json({ status: 400, message: "Bad Request", error: "Type needs to be either js or basic" });
        }
    
        if (isNaN(parseInt(permissions)) === true) {
            return res.json({ status: 400, message: "Bad Request", error: "Permissions needs to be a number" });
        }
    
        if (typeof match !== "string" || match.length === 0) {
            return res.json({ status: 400, message: "Bad Request", error: "Match cannot be 0 length" });
        }
    
        if (match_type !== "command" && match_type !== "startswith" && match_type !== "contains" && match_type !== "exactmatch") {
            return res.json({ status: 400, message: "Bad Request", error: "Match type needs to be either command, startswith, contains or exactmatch" });
        }
    
        const script = new schemas.ScriptSchema({
            local,
            name,
            description,
            type,
            permissions,
            match,
            match_type,
            code
        });
    
        let user_script;
        try {
    
            user_script = await script.save();
        } catch(error) {
    
            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }

        req.user.scripts.push(user_script._id);

        try {

            await req.user.save();
        } catch(error) {

            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }
    
        res.json({ status: 200, message: "OK", error: null });
});

router.route("/@me/:object_id").get(authUser, async (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    let found = false;
    for (let script_id of req.user.scripts) {
        if (script_id.equals(object_id)) {
            
            found = true;
            break;
        }
    }

    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    let script_doc;
    try {

        script_doc = await schemas.ScriptSchema.findById(object_id);
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (script_doc === null) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    const script_obj = script_doc.toObject();

    delete script_obj.__v;

    res.json(script_obj);

}).patch(authUser, async (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    let found = false;
    for (let script_id of req.user.scripts) {
        if (script_id.equals(object_id)) {
            
            found = true;
            break;
        }
    }

    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    const name = req.body.name === undefined ? null : req.body.name;
    const description = req.body.description === undefined ? null : req.body.description;
    const type = req.body.type === undefined ? null : req.body.type;
    const permissions = req.body.permissions === undefined ? null : req.body.permissions;
    const match = req.body.match === undefined ? null : req.body.match;
    const match_type = req.body.match_type === undefined ? null : req.body.match_type;
    const code = req.body.code === undefined ? null : req.body.code;

    if (type !== null && (type !== "js" && type !== "basic")) {
        return res.json({ status: 400, message: "Bad Request", error: "Type needs to be either js or basic" });
    }

    if (permissions !== null && isNaN(parseInt(permissions)) === true) {
        return res.json({ status: 400, message: "Bad Request", error: "Permissions needs to be a number" });
    }

    if (match !== null && (typeof match !== "string" || match.length === 0)) {
        return res.json({ status: 400, message: "Bad Request", error: "Match cannot be 0 length" });
    }

    if (match_type !== null && (match_type !== "command" && match_type !== "startswith" && match_type !== "contains" && match_type !== "exactmatch")) {
        return res.json({ status: 400, message: "Bad Request", error: "Match type needs to be either command, startswith, contains or exactmatch" });
    }

    let upd_script;
    try {

        upd_script = await schemas.ScriptSchema
            .findOneAndUpdate({
                _id: object_id
            }, {
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (upd_script === null) {
        return res.json({ status: 404, message: "Not Found", error: "The script that you are trying to update could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });

}).delete(authUser, async (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    let found = false;
    for (let i = 0; i < req.user.scripts.length; i++) {
        if (req.user.scripts[i].equals(object_id)) {
            
            req.user.scripts.splice(i, 1);
            found = true;
            break;
        }
    }

    if (found === false) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    try {

        await req.user.save();
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/:object_id").get(authAdmin, async (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    let script_doc;
    try {

        script_doc = await schemas.ScriptSchema.findById(object_id);
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (script_doc === null) {
        return res.json({ status: 404, message: "Not Found", error: "No scripts found" });
    }

    res.json(script_doc);

}).patch(authAdmin, async (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    const local = req.body.local === undefined ? null : req.body.local;
    const name = req.body.name === undefined ? null : req.body.name;
    const description = req.body.description === undefined ? null : req.body.description;
    const type = req.body.type === undefined ? null : req.body.type;
    const permissions = req.body.permissions === undefined ? null : req.body.permissions;
    const match = req.body.match === undefined ? null : req.body.match;
    const match_type = req.body.match_type === undefined ? null : req.body.match_type;
    const code = req.body.code === undefined ? null : req.body.code;

    if (local !== null && (local !== true && local !== false)) {
        return res.json({ status: 400, message: "Bad Request", error: "Local needs to be a boolean" });
    }

    if (local !== null && (local === false && code === null)) {
        return res.json({ status: 400, message: "Bad Request", error: "Code needs to be specified if local is set to false" });
    }

    if (type !== null && (type !== "js" && type !== "basic")) {
        return res.json({ status: 400, message: "Bad Request", error: "Type needs to be either js or basic" });
    }

    if (permissions !== null && isNaN(parseInt(permissions)) === true) {
        return res.json({ status: 400, message: "Bad Request", error: "Permissions needs to be a number" });
    }

    if (match !== null && (typeof match !== "string" || match.length === 0)) {
        return res.json({ status: 400, message: "Bad Request", error: "Match cannot be 0 length" });
    }

    if (match_type !== null && (match_type !== "command" && match_type !== "startswith" && match_type !== "contains" && match_type !== "exactmatch")) {
        return res.json({ status: 400, message: "Bad Request", error: "Match type needs to be either command, startswith, contains or exactmatch" });
    }

    let upd_script;
    try {

        upd_script = await schemas.ScriptSchema
            .findOneAndUpdate({
                _id: object_id
            }, {
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (upd_script === null) {
        return res.json({ status: 404, message: "Not Found", error: "The script that you are trying to update could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });

}).delete(authAdmin, async (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400, message: "Bad Request", error });
    }

    let promises = [];
    let del_log = [];

    let user_docs;
    try {

        user_docs = await schemas.UserSchema
            .find({
                scripts: object_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_docs.length !== 0) {

        for (let user_doc of user_docs) {

            for (let i = 0; i < user_doc.scripts.length; i++) {
                if (object_id.equals(user_doc.scripts[i])) {
                    
                    user_doc.scripts.splice(i, 1);
                    break;
                }
            }
    
            promises.push(user_doc.save());
        }

        del_log.push(`${user_docs.length} user(s)`);
    }

    let guild_docs;
    try {

        guild_docs = await schemas.GuildSchema
            .find({
                scripts: { $elemMatch: { object_id } }
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (guild_docs.length !== 0) {

        for (let guild_doc of guild_docs) {

            for (let i = 0; i < guild_doc.scripts.length; i++) {
                if (object_id.equals(guild_doc.scripts[i].object_id)) {
                    
                    guild_doc.scripts.splice(i, 1);
                    break;
                }
            }

            promises.push(guild_doc.save());
        }

        del_log.push(`${guild_docs.length} guild(s)`);
    }

    try {

        await Promise.all(promises);
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    let del_script;
    try {

        del_script =  await schemas.ScriptSchema
            .findOneAndRemove({
                _id: object_id
            });
    } catch(error) {
      
        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (del_script !== null) {

        del_log.push("script doc");
    }

    if (del_log.length === 0) {
        return res.json({ status: 404, message: "Not Found", error: "The script that youre trying to delete could not be found anywhere" });
    }

    res.json({ status: 200, message: `OK ${del_log}`, error: null });
});

module.exports = router;
