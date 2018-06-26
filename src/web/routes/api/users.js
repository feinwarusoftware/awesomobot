"use strict";

const fs = require("fs");
const path = require("path");

const express = require("express");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { fetchSession, authLogin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

router.post("/", fetchSession, authLogin, (req, res) => {

    // Admin only.

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async doc => {
            if (doc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (doc.admin === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only path" });
            }

            const discord_id = req.body.discord_id === undefined ? null : req.body.discord_id;
            const admin = req.body.admin === undefined ? null : req.body.admin;
            const scripts = req.body.scripts === undefined ? null : req.body.scripts;

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scripts }
                    })
                    .then(docs => {
                        if (docs.length !== scripts.length) {
                            return -1;
                        }

                        return 0;
                    })
                    .catch(err => {

                        return err;
                    });

                if (status !== 0) {
                    return res.json({ status: 500, message: "Internal Server Error", error: status === -1 ? "Could not find script(s) specified" : status });
                }
            }

            const user = new schemas.UserSchema({
                ...(discord_id === null ? {} : { discord_id }),
                ...(admin === null ? {} : { admin }),
                ...(scripts === null ? {} : { scripts })
            });

            user
                .save()
                .then(doc => {

                    res.json({ status: 200, message: "OK", error: null });
                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });
});

router.get("/@me", fetchSession, authLogin, (req, res) => {
    
    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(doc => {
            if (doc === null) {
                return res.json({ status: 404, message: "Not Found", error: null });
            }

            const resdoc = doc.toObject();

            if (doc.admin === false) {

                delete resdoc._id;
                delete resdoc.__v;
                delete resdoc.admin;
            }

            res.json(resdoc);
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });
});

router.route("/:discord_id").get(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited, if discord_id === user.id).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (userdoc.admin === false && req.session.discord.id !== req.params.discord_id) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            schemas.UserSchema
                .findOne({
                    discord_id: req.params.discord_id
                })
                .then(querydoc => {
                    if (querydoc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "User doc not found" });
                    }

                    const resdoc = querydoc.toObject();

                    if (userdoc.admin === false) {

                        delete resdoc._id;
                        delete resdoc.__v;
                        delete resdoc.admin;
                    }

                    res.json(resdoc);

                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });

        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

}).put(fetchSession, authLogin, (req, res) => {
    
    // Admin, user (limited, if discord_id === user.id).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (userdoc.admin === false && req.session.discord.id !== req.params.discord_id) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            let admin = req.body.admin === undefined ? false : req.body.admin;
            let scripts = req.body.scripts === undefined ? [] : req.body.scripts;

            // Ignore user input for the following fields if theyre not admin.
            if (userdoc.admin === false) {

                admin = null;
                scripts = null;
            }

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scripts }
                    })
                    .then(docs => {
                        if (docs.length !== scripts.length) {
                            return -1;
                        }

                        return 0;
                    })
                    .catch(err => {

                        return err;
                    });

                    if (status !== 0) {
                        return res.json({ status: 500, message: "Internal Server Error", error: status === -1 ? "Could not find script(s) specified" : status });
                    }
            }

            const update = {
                ...(admin === null ? {} : { admin }),
                ...(scripts === null ? {} : { scripts })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.UserSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(doc => {
                    if (doc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to put" });
                    }

                    res.json({ status: 200, message: "OK", error: null, debug: raw });
                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

}).patch(fetchSession, authLogin, (req, res) => {
    
    // Admin, user (limited, if discord_id === user.id).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (userdoc.admin === false && req.session.discord.id !== req.params.discord_id) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            let admin = req.body.admin === undefined ? null : req.body.admin;
            let scripts = req.body.scripts === undefined ? null : req.body.scripts;

            // Ignore user input for the following fields if theyre not admin.
            if (userdoc.admin === false) {

                admin = null;
                scripts = null;
            }

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scripts }
                    })
                    .then(docs => {
                        if (docs.length !== scripts.length) {
                            return -1;
                        }

                        return 0;
                    })
                    .catch(err => {

                        return err;
                    });

                    if (status !== 0) {
                        return res.json({ status: 500, message: "Internal Server Error", error: status === -1 ? "Could not find script(s) specified" : status });
                    }
            }

            const update = {
                ...(admin === null ? {} : { admin }),
                ...(scripts === null ? {} : { scripts })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.UserSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(doc => {
                    if (doc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to patch" });
                    }

                    res.json({ status: 200, message: "OK", error: null, debug: raw });
                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

}).delete(fetchSession, authLogin, (req, res) => {
    
    // Admin only.

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(doc => {
            if (doc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (doc.admin === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only path" });
            }

            schemas.UserSchema
                .findOneAndRemove({
                    discord_id: req.params.discord_id
                })
                .then(doc => {
                    if (doc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to remove" });
                    }

                    res.json({ status: 200, message: "OK", error: null });
                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

});

module.exports = router;
