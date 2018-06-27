"use strict";

const express = require("express");
const axios = require("axios");

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
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            if (userdoc.admin === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only path" });
            }

            const discord_id = req.body.discord_id === undefined ? null : req.body.discord_id;
            const prefix = req.body.prefix === undefined ? null : req.body.prefix;
            const log_channel_id = req.body.log_channel_id === undefined ? null : req.body.log_channel_id;
            const log_events = req.body.log_events === undefined ? null : req.body.log_events;
            const scripts = req.body.scripts === undefined ? null : req.body.scripts;

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                let scriptIds = [];
                for (let script of scripts) {
                    if (script.object_id === undefined) {
                        return res.json({ status: 404, message: "Not Found", error: "One or more scripts not found" });
                    }
                    scriptIds.push(script.object_id);
                }

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scriptIds }
                    })
                    .then(docs => {
                        if (docs.length !== scriptIds.length) {
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

            const guild = new schemas.GuildSchema({
                ...(discord_id === null ? {} : { discord_id }),
                ...(prefix === null ? {} : { prefix }),
                ...(log_channel_id === null ? {} : { log_channel_id }),
                ...(log_events === null ? {} : { log_events }),
                ...(scripts === null ? {} : { scripts })
            });

            guild
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

    // Admin, user (limited, if user.roles | manage server).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let ids = await axios({
                    method: "get",
                    url: "https://discordapp.com/api/v6/users/@me/guilds",
                    headers: {
                        "Authorization": `Bearer ${"HYrvwyjKjkkxlKWRtpf6VFaCQNYlpm"}`
                    }
                })
                .then(userguilds => {

                    const ids = [];
                    for (let userguild of userguilds.data) {
                        if ((userguild.permissions & 8) === 8) {

                            ids.push(userguild.id);
                        }
                    }

                    return ids;
                })
                .catch(err => {

                    return err;
                });

            if (ids instanceof Array === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Discord perm lookup" });
            }

            schemas.GuildSchema
                .find({
                    discord_id: { $in: ids }
                })
                .then(guilddocs => {


                    let resdocs = guilddocs.map(e => {

                        return e.toObject();
                    });

                    if (userdoc.admin === false) {

                        resdocs = resdocs.map(e => {

                            delete e.__v;
                            delete e.local;

                            return e;
                        });
                    }

                    res.json(resdocs);

                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

});

router.route("/:discord_id").get(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited, if user.roles | manage server).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let perms = await axios({
                    method: "get",
                    url: "https://discordapp.com/api/v6/users/@me/guilds",
                    headers: {
                        "Authorization": `Bearer ${req.session.discord.access_token}`
                    }
                })
                .then(userguilds => {

                    let perms = 0;
                    for (let userguild of userguilds.data) {
                        if (userguild.id === req.params.discord_id) {

                            perms = userguild.permissions;
                            break;
                        }
                    }
                    return perms;

                })
                .catch(err => {

                    return err;
                });

            if (userdoc.admin === false && (typeof perms !== "number" || (perms & 8) === 0)) {
                return res.json({ status: 403, message: "Forbidden", error: "Discord perm lookup" });
            }

            schemas.GuildSchema
                .findOne({
                    discord_id: req.params.discord_id
                })
                .then(guilddoc => {
                    if (guilddoc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Guild doc not found" });
                    }

                    const resdoc = guilddoc.toObject();

                    if (userdoc.admin === false) {

                        delete resdoc._id;
                        delete resdoc.__v;
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

    // Admin, user (limited, if user.roles | manage server).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let perms = await axios({
                    method: "get",
                    url: "https://discordapp.com/api/v6/users/@me/guilds",
                    headers: {
                        "Authorization": `Bearer ${req.session.discord.access_token}`
                    }
                })
                .then(userguilds => {

                    let perms = 0;
                    for (let userguild of userguilds.data) {
                        if (userguild.id === req.params.discord_id) {

                            perms = userguild.permissions;
                            break;
                        }
                    }
                    return perms;

                })
                .catch(err => {

                    return err;
                });

            if (userdoc.admin === false && (typeof perms !== "number" || (perms & 8) === 0)) {
                return res.json({ status: 403, message: "Forbidden", error: "Discord perm lookup" });
            }

            const prefix = req.body.prefix === undefined ? "<<" : req.body.prefix;
            const log_channel_id = req.body.log_channel_id === undefined ? "000000000000000000" : req.body.log_channel_id;
            const log_events = req.body.log_events === undefined ? "000000000000000000" : req.body.log_events;
            const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                let scriptIds = [];
                for (let script of scripts) {
                    if (script.object_id === undefined) {
                        return res.json({ status: 404, message: "Not Found", error: "One or more scripts not found" });
                    }
                    scriptIds.push(script.object_id);
                }

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scriptIds }
                    })
                    .then(docs => {
                        if (docs.length !== scriptIds.length) {
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
                ...(discord_id === null ? {} : { discord_id }),
                ...(prefix === null ? {} : { prefix }),
                ...(log_channel_id === null ? {} : { log_channel_id }),
                ...(log_events === null ? {} : { log_events }),
                ...(scripts === null ? {} : { scripts })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.GuildSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(guilddoc => {
                    if (guilddoc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to put" });
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

}).patch(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited, if user.roles | manage server).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let perms = await axios({
                    method: "get",
                    url: "https://discordapp.com/api/v6/users/@me/guilds",
                    headers: {
                        "Authorization": `Bearer ${req.session.discord.access_token}`
                    }
                })
                .then(userguilds => {

                    let perms = 0;
                    for (let userguild of userguilds.data) {
                        if (userguild.id === req.params.discord_id) {

                            perms = userguild.permissions;
                            break;
                        }
                    }
                    return perms;

                })
                .catch(err => {

                    return err;
                });

            if (userdoc.admin === false && (typeof perms !== "number" || (perms & 8) === 0)) {
                return res.json({ status: 403, message: "Forbidden", error: "Discord perm lookup" });
            }

            const prefix = req.body.prefix === undefined ? "<<" : req.body.prefix;
            const log_channel_id = req.body.log_channel_id === undefined ? "000000000000000000" : req.body.log_channel_id;
            const log_events = req.body.log_events === undefined ? "000000000000000000" : req.body.log_events;
            const scripts = req.body.scripts === undefined ? [] : req.body.scripts;

            // Make sure script ids are valid.
            if (scripts instanceof Array && scripts.length > 0) {

                let scriptIds = [];
                for (let script of scripts) {
                    if (script.object_id === undefined) {
                        return res.json({ status: 404, message: "Not Found", error: "One or more scripts not found" });
                    }
                    scriptIds.push(script.object_id);
                }

                const status = await schemas.ScriptSchema
                    .find({
                        _id: { $in: scriptIds }
                    })
                    .then(docs => {
                        if (docs.length !== scriptIds.length) {
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
                ...(discord_id === null ? {} : { discord_id }),
                ...(prefix === null ? {} : { prefix }),
                ...(log_channel_id === null ? {} : { log_channel_id }),
                ...(log_events === null ? {} : { log_events }),
                ...(scripts === null ? {} : { scripts })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.GuildSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(guilddoc => {
                    if (guilddoc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to put" });
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

}).delete(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited, if user.roles | manage server).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let perms = await axios({
                    method: "get",
                    url: "https://discordapp.com/api/v6/users/@me/guilds",
                    headers: {
                        "Authorization": `Bearer ${req.session.discord.access_token}`
                    }
                })
                .then(userguilds => {

                    let perms = 0;
                    for (let userguild of userguilds.data) {
                        if (userguild.id === req.params.discord_id) {

                            perms = userguild.permissions;
                            break;
                        }
                    }
                    return perms;

                })
                .catch(err => {

                    return err;
                });

            if (userdoc.admin === false && (typeof perms !== "number" || (perms & 8) === 0)) {
                return res.json({ status: 403, message: "Forbidden", error: "Discord perm lookup" });
            }

            schemas.GuildSchema
                .findOneAndRemove({
                    discord_id: req.params.discord_id
                })
                .then(guilddoc => {
                    if (guilddoc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Guild doc not found" });
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
