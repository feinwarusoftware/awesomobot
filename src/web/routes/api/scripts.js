"use strict";

const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { fetchSession, authLogin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

router.route("/").get(fetchSession, authLogin, (req, res) => {

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            const limitDef = 10;
            const limitMax = 25;

            const pageDef = 0;

            const page = req.query.page === undefined ? pageDef : req.query.page;
            let limit = req.query.limit === undefined ? limitDef : parseInt(req.query.limit);
            
            if (isNaN(limit)) {
                limit = limitDef;
            }
            if (limit > limitMax) {
                limit = limitMax;
            }

            const local = req.query.local === undefined ? null : req.query.local === "true";
            const name = req.query.name === undefined ? null : req.query.name;
            const type = req.query.type === undefined ? null : req.query.type;
            const permissions = req.query.permissions === undefined ? null : req.query.permissions;
            const match = req.query.match === undefined ? null : req.query.match;
            const match_type = req.query.match_type === undefined ? null : req.query.match_type;

            schemas.ScriptSchema
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
                    _id: 0,
                    __v: 0
                })
                .then(scriptdocs => {
                    scriptdocs = scriptdocs.filter(doc => {
                        return permissions === null ? true : doc.permissions & permissions;
                    });

                    res.json(scriptdocs);
                })
                .catch(err => {

                    res.json({ err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

}).post(fetchSession, authLogin, (req, res) => {

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

            const local = req.body.local === undefined ? null : req.body.local;
            const name = req.body.local === undefined ? null : req.body.name;
            const description = req.body.local === undefined ? null : req.body.description;
            const type = req.body.local === undefined ? null : req.body.type;
            const permissions = req.body.local === undefined ? null : req.body.permissions;
            const match = req.body.local === undefined ? null : req.body.match;
            const match_type = req.body.local === undefined ? null : req.body.match_type;
            const code = req.body.local === undefined ? null : req.body.code;

            const script = new schemas.ScriptSchema({
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            });

            script
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

router.route("/@me").get(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 404, message: "Not Found", error: null });
            }

            schemas.ScriptSchema
                .find({
                    _id: { $in: userdoc.scripts }
                })
                .then(scriptdocs => {
                    if (scriptdocs.length === 0) {
                        return res.json({ status: 404, message: "Not Found", error: null });
                    }

                    let resdocs = scriptdocs.map(e => {

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

}).post(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let local = req.body.local === undefined ? null : req.body.local;
            const name = req.body.local === undefined ? null : req.body.name;
            const description = req.body.local === undefined ? null : req.body.description;
            const type = req.body.local === undefined ? null : req.body.type;
            const permissions = req.body.local === undefined ? null : req.body.permissions;
            const match = req.body.local === undefined ? null : req.body.match;
            const match_type = req.body.local === undefined ? null : req.body.match_type;
            const code = req.body.local === undefined ? null : req.body.code;

            if (userdoc.admin === false) {
                local = false;
            }

            const script = new schemas.ScriptSchema({
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            });

            script
                .save()
                .then(scriptdoc => {

                    userdoc.scripts.push(scriptdoc._id);

                    userdoc
                        .save()
                        .then(userdoc => {

                            res.json({ status: 200, message: "OK", error: null });
                        })
                        .catch(err => {

                            res.json({ status: 500, message: "Internal Server Error", error: err });
                        });
                })
                .catch(err => {

                    res.json({ status: 500, message: "Internal Server Error", error: err });
                });
        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });

});

router.route("/:object_id").get(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 404, message: "Not Found", error: null });
            }

            schemas.ScriptSchema
                .findOne({
                    _id: { $in: req.params.object_id }
                })
                .then(scriptdoc => {
                    if (scriptdoc.length === 0) {
                        return res.json({ status: 404, message: "Not Found", error: null });
                    }

                    let resdoc = scriptdoc.toObject();

                    if (userdoc.admin === false) {

                        delete resdoc.__v;
                        delete resdoc.local;
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

    // Admin, user (limited, if Object_id in user.scripts).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let found = false;
            for (let script of userdoc.scripts) {
                if (script.equals(mongoose.Types.ObjectId(req.params.object_id))) {
                    
                    found = true;
                    break;
                }
            }

            if (userdoc.admin === false && found === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            let local = req.body.local === undefined ? false : req.body.local;
            let name = req.body.name === undefined ? `cmd_${crypto.randomBytes(4).toString("hex")}` : req.body.name;
            let description = req.body.description === undefined ? "*(placeholder)*" : req.body.description;
            let type = req.body.type === undefined ? "js" : req.body.type;
            let permissions = req.body.permissions === undefined ? 0 : req.body.permissions;
            let match = req.body.match === undefined ? `match_${crypto.randomBytes(4).toString("hex")}` : req.body.match;
            let match_type = req.body.match_type === undefined ? "command" : req.body.match_type;
            let code = req.body.code === undefined ? "message.reply('default');" : req.body.code;

            // Ignore user input for the following fields if theyre not admin.
            if (userdoc.admin === false) {

                local = null;
            }

            const update = {
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.ScriptSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(scriptdoc => {
                    if (scriptdoc === null) {
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

    // Admin, user (limited, if Object_id in user.scripts).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let found = false;
            for (let script of userdoc.scripts) {
                if (script.equals(mongoose.Types.ObjectId(req.params.object_id))) {
                    
                    found = true;
                    break;
                }
            }

            if (userdoc.admin === false && found === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            let local = req.body.local === undefined ? null : req.body.local;
            let name = req.body.name === undefined ? null : req.body.name;
            let description = req.body.description === undefined ? null : req.body.description;
            let type = req.body.type === undefined ? null : req.body.type;
            let permissions = req.body.permissions === undefined ? null : req.body.permissions;
            let match = req.body.match === undefined ? null : req.body.match;
            let match_type = req.body.match_type === undefined ? null : req.body.match_type;
            let code = req.body.code === undefined ? null : req.body.code;

            // Ignore user input for the following fields if theyre not admin.
            if (userdoc.admin === false) {

                local = null;
            }

            const update = {
                ...(local === null ? {} : { local }),
                ...(name === null ? {} : { name }),
                ...(description === null ? {} : { description }),
                ...(type === null ? {} : { type }),
                ...(permissions === null ? {} : { permissions }),
                ...(match === null ? {} : { match }),
                ...(match_type === null ? {} : { match_type }),
                ...(code === null ? {} : { code })
            };

            // Return if theres nothing to update.
            if (Object.keys(update).length === 0) {
                return res.json({ status: 200, message: "OK", error: null, debug: "no changes made" });
            }

            schemas.ScriptSchema
                .findOneAndUpdate({
                    discord_id: req.params.discord_id
                }, 
                    update
                )
                .then(scriptdoc => {
                    if (scriptdoc === null) {
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

    // Admin, user (limited, if Object_id in user.scripts).
    // Removes the script from the user and all guilds.

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            let found = false;
            for (let script of userdoc.scripts) {
                if (script.equals(mongoose.Types.ObjectId(req.params.object_id))) {
                    
                    found = true;
                    break;
                }
            }

            if (userdoc.admin === false && found === false) {
                return res.json({ status: 403, message: "Forbidden", error: "Admin only use" });
            }

            schemas.UserSchema
                .findOne({
                    scripts: req.params.object_id
                })
                .then(quserdoc => {
                    if (quserdoc === null) {

                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to remove" });
                    }

                    let found = false;
                    for (let i = 0; i < quserdoc.scripts.length; i++) {
                        if (quserdoc.scripts[i].equals(mongoose.Types.ObjectId(req.params.object_id))) {

                            found = true;
                            quserdoc.scripts.splice(i, 1);
                            break;
                        }
                    }
                    if (found === false) {

                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to remove" });
                    }

                    quserdoc
                        .save()
                        .then(doc => {
                            if (doc === null) {

                                return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to remove" });
                            }

                            schemas.GuildSchema
                                .find({
                                    scripts: { $elemMatch: { object_id: req.params.object_id } }
                                })
                                .then(guilddocs => {
        
                                    const promises = [];
        
                                    for (let i = 0; i < guilddocs.length; i++) {
        
                                        let found = false;
                                        for (let j = 0; j < guilddocs[i].scripts.length; j++) {
                                            if (guilddocs[i].scripts[j].object_id.equals(mongoose.Types.ObjectId(req.params.object_id))) {
        
                                                found = true;
                                                guilddocs[i].scripts.splice(j, 1);
                                                break;
                                            }
                                        }
        
                                        if (found === false) {
                                            return res.json({ status: 500, message: "Internal Server Error", error: err, debug: "script not removed" });
                                        }
        
                                        promises.push(guilddocs[i].save());
                                    }
        
                                    if (promises.length === 0) {
                                        return res.json({ status: 200, message: "OK", error: null, debug: "no guilds found" });
                                    }
        
                                    Promise
                                        .all(promises)
                                        .then(uguilddocs => {
                                            if (uguilddocs.length !== guilddocs.length) {
                                                return res.json({ status: 500, message: "Internal Server Error", error: err, debug: "not all saved" });
                                            }

                                            schemas.ScriptSchema
                                                .findOneAndRemove({
                                                    _id: req.params.object_id
                                                })
                                                .then(scriptdoc => {
                                                    if (scriptdoc === null) {
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
                                })
                                .catch(err => {
        
                                    res.json({ status: 500, message: "Internal Server Error", error: err });
                                });
                        })
                        .catch(err => {

                            res.json({ status: 500, message: "Internal Server Error", error: err });
                        });
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
