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

        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    res.json({ status: 200, message: "OK", error: null });
});

router.route("/@me").get(authUser, (req, res) => {



}).put(authUser, (req, res) => {
    


}).patch(authUser, (req, res) => {
    


}).delete(authUser, (req, res) => {
    


});

router.route("/:discord_id").get(authAdmin, (req, res) => {


    
}).put(authAdmin, (req, res) => {
    


}).patch(authAdmin, (req, res) => {
    


}).delete(authAdmin, (req, res) => {
    


});

/*
router.route("/@me").get(fetchSession, authLogin, (req, res) => {
    
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

}).put(fetchSession, authLogin, (req, res) => {

    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
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
                    discord_id: req.session.discord.id
                }, 
                    update
                )
                .then(doc => {
                    if (doc === null) {
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
    
    // Admin, user (limited).

    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(async userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
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
                    discord_id: req.session.discord.id
                }, 
                    update
                )
                .then(doc => {
                    if (doc === null) {
                        return res.json({ status: 404, message: "Not Found", error: "Could not find the doc that youre trying to patch" });
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
*/

module.exports = router;
