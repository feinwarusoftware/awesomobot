"use strict";

const express = require("express");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

router.post("/", authAdmin, async (req, res) => {

    // Get input.
    const discord_id = req.body.discord_id === undefined ? null : req.body.discord_id;
    const admin = req.body.admin === undefined ? false : req.body.admin;
    const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

    // Check discord id.
    if (discord_id === null || discord_id.length !== 18) {
        return res.json({ status: 400, message: "Bad Request", error: "Discord id not specified or incorrect" });
    }

    let old_discord_id;
    try {

        old_discord_id = await schemas.UserSchema
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

    // Check scripts.
    if (scripts instanceof Array === false) {
        return res.json({ status: 400, message: "Bad Request", error: "Scripts should be an array" });
    }

    if (scripts.length > 0) {

        let script_docs;
        try {
    
            script_docs = await schemas.ScriptSchema
                .find({
                    _id: { $in: scripts }
                });
        } catch(error) {
    
            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }

        if (script_docs.length !== scripts.length) {
            return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
        }
    }

    // Create new user.
    const user = new schemas.UserSchema({
        discord_id,
        admin,
        scripts
    });

    try {

        await user.save();
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/@me").get(authUser, (req, res) => {

    const user_obj = req.user.toObject();

    delete user_obj._id;
    delete user_obj.__v;

    res.json(user_obj);

}).patch(authUser, (req, res) => {
    
    // Currently no fields that users can edit.
    res.json({ status: 200, message: "OK", error: null });

}).delete(authUser, async (req, res) => {
    
    let del_user;
    try {

        del_user = await schemas.UserSchema
            .findOneAndRemove({
                discord_id: req.user.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (del_user === null) {
        return res.json({ status: 404, message: "Not Found", error: "The user that you are trying to delete could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/:discord_id").get(authAdmin, async (req, res) => {

    let user_doc;
    try {

        user_doc = await schemas.UserSchema
            .findOne({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (user_doc === null) {
        return res.json({ status: 404, message: "Not Found", error: "The user could not be found" });
    }

    res.json(user_doc);

}).patch(authAdmin, (req, res) => {
    
    const admin = req.body.admin === undefined ? null : req.body.admin;
    const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

    // Check scripts.
    if (scripts instanceof Array === false) {
        return res.json({ status: 400, message: "Bad Request", error: "Scripts should be an array" });
    }

    if (scripts.length > 0) {

        let script_docs;
        try {
    
            script_docs = await schemas.ScriptSchema
                .find({
                    _id: { $in: scripts }
                });
        } catch(error) {
    
            apiLogger.error(error);
            return res.json({ status: 500, message: "Internal Server Error", error });
        }

        if (script_docs.length !== scripts.length) {
            return res.json({ status: 400, message: "Bad Request", error: "Script(s) specified could not be found" });
        }
    }

    let upd_user;
    try {

        upd_user = await schemas.UserSchema
            .findOneAndUpdate({
                discord_id: req.params.discord_id
            }, {
                ...(admin === null ? {} : { admin }),
                ...(scripts.length === 0 ? {} : { scripts })
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (upd_user === null) {
        return res.json({ status: 404, message: "Not Found", error: "The user that you are trying to update could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });

}).delete(authAdmin, async (req, res) => {
    
    let del_user;
    try {

        del_user = await schemas.UserSchema
            .findOneAndRemove({
                discord_id: req.params.discord_id
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (del_user === null) {
        return res.json({ status: 404, message: "Not Found", error: "The user that you are trying to delete could not be found" });
    }

    res.json({ status: 200, message: "OK", error: null });
});

module.exports = router;
