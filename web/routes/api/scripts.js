"use strict";

const express = require("express");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const { authUser } = require("../../middlewares");
const { getUserData, getUserDataNoSession } = require("../../helpers");

const { getClient } = require("../../helpers/client");

const router = express.Router();
const { log: { info, warn, error } } = require("../../../utils");

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

const defaultValue = (param, def) => {

    return param === undefined ? def : param;
}

router.route("/").get(authUser, async (req, res) => {

    const client = await getClient();

    // + cond user data
    const extended = req.query.extended === "true" ? true : req.query.extended === "false" ? false : undefined;

    // Parse the amount of scripts that the api will return.
    let limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
        limit = defaultSearchLimit;
    }
    limit = Math.min(limit, maxSearchLimit);

    // Parse the current page of scripts that the api will return.
    const page = defaultValue(req.query.page, defaultSearchPage);

    // Parse other search parameters. Add only the allowed parameters into a new search object.
    const search = {
        ...( req.query.local === undefined ? {} : { local: req.query.local } ),
        ...( req.query.verified === undefined ? {} : { verified: req.query.verified } ),
        ...( req.query.featured === undefined ? {} : { featured: req.query.featured } ),
        ...( req.query.marketplace_enabled === undefined ? { marketplace_enabled: true } : { marketplace_enabled: req.user.admin === false ? true : req.query.marketplace_enabled === "true" ? true : false } ),
        ...( req.query.name === undefined ? {} : { name: { $regex: `.*${req.query.name}.*`, $options: "i" } } )
    };

    schemas.ScriptSchema
        .count(search)
        .then(total => {

            schemas.ScriptSchema
                .find(search)
                .skip(page * limit)
                .limit(limit)
                .select({ __v: 0 })
                .then(async docs => {

                    if (extended === true) {

                        const script_objs = docs.map(doc => doc.toObject());
                        const search_ids = docs.map(doc => doc.author_id);

                        for (let i = 0; i < script_objs.length; i++) {

                            if (script_objs[i].author_id === "feinwaru-devs") {

                                script_objs[i].author_username = "Feinwaru";
                                continue;
                            }

                            // other users
                            const user = await client.fetchUser(script_objs[i].author_id, true).catch(err => {
                                
                                error(err);
                                return res.json({ status: 500 });
                            });

                            script_objs[i].author_username = user.username;
                        }

                        schemas.UserSchema
                            .find({
                                discord_id: {
                                    $in: search_ids
                                }
                            })
                            .then(users => {

                                for (let i = 0; i < script_objs.length; i++) {

                                    for (let user of users) {

                                        if (user.discord_id === script_objs[i].author_id) {

                                            script_objs[i].author_verified = user.verified;
                                        }
                                    }
                                }

                                return res.json({ status: 200, page, limit, total, scripts: script_objs });
                            })
                            .catch(err => {

                                error(err);
                                return res.json({ status: 500 });
                            });
                    } else {

                        return res.json({ status: 200, page, limit, total, scripts: docs });
                    }
                })
                .catch(err => {
        
                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });

}).post(authUser, (req, res) => {

    let params = {};
    params.author_id = req.user.discord_id;
    params = { ...params, ...(req.body.name === undefined ? {} : { name: req.body.name } ) };
    params = { ...params, ...(req.body.description === undefined ? {} : { description: req.body.description } ) };
    params = { ...params, ...(req.body.thumbnail === undefined ? {} : { thumbnail: req.body.thumbnail } ) };
    params = { ...params, ...(req.body.marketplace_enabled === undefined ? {} : { marketplace_enabled: req.body.marketplace_enabled } ) };

    params = { ...params, ...(req.body.type === undefined ? {} : { type: req.body.type } ) };
    params = { ...params, ...(req.body.match_type === undefined ? {} : { match_type: req.body.match_type } ) };
    params = { ...params, ...(req.body.match === undefined ? {} : { match: req.body.match } ) };

    params = { ...params, ...(req.body.code === undefined ? {} : { code: req.body.code } ) };
    params = { ...params, ...(req.body.data === undefined ? {} : { data: req.body.data } ) };

    if (req.user.admin === true) {

        params = { ...params, ...(req.body.local === undefined ? {} : { local: req.body.local } ) };
        params = { ...params, ...(req.body.featured === undefined ? {} : { featured: req.body.featured } ) };
        params = { ...params, ...(req.body.verified === undefined ? {} : { verified: req.body.verified } ) };
        params = { ...params, ...(req.body.likes === undefined ? {} : { likes: req.body.likes } ) };
        params = { ...params, ...(req.body.guild_count === undefined ? {} : { guild_count: req.body.guild_count } ) };
        params = { ...params, ...(req.body.use_count === undefined ? {} : { use_count: req.body.use_count } ) };
    }

    params = { ...params, ...(req.body.created_with === undefined ? {} : { created_with: req.body.created_with } ) };
    params.updated_at = Date.now();
    
    const script = new schemas.ScriptSchema(params);

    script
        .save()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });
});

router.route("/@me").get(authUser, (req, res) => {

    // Parse the amount of scripts that the api will return.
    let limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
        limit = defaultSearchLimit;
    }
    limit = Math.min(limit, maxSearchLimit);

    // Parse the current page of scripts that the api will return.
    const page = defaultValue(req.query.page, defaultSearchPage);

    // Parse other search parameters. Add only the allowed parameters into a new search object.
    const search = {
        ...( req.query.local === undefined ? {} : { local: req.query.local } ),
        ...( req.query.verified === undefined ? {} : { verified: req.query.verified } ),
        ...( req.query.featured === undefined ? {} : { featured: req.query.featured } ),
        ...( req.query.marketplace_enabled === undefined ? {} : { marketplace_enabled: req.query.marketplace_enabled } ),
        ...( req.query.name === undefined ? {} : { name: { $regex: `.*${req.query.name}.*` } } )
    };

    schemas.ScriptSchema
        .count({
            author_id: req.user.discord_id,
            ...search
        })
        .then(total => {
            if (total === 0) {

                return res.json({ status: 404 });
            }

            schemas.ScriptSchema
                .find({
                    author_id: req.user.discord_id,
                    ...search
                })
                .skip(page * limit)
                .limit(limit)
                .select({ __v: 0 })
                .then(docs => {
        
                    return res.json({ status: 200, page, limit, total, scripts: docs });
                })
                .catch(err => {
        
                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });
});

router.route("/:object_id").get(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(err) {

        return res.json({ status: 400 });
    }

    schemas.ScriptSchema
        .findById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.marketplace_enabled === false && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            const script_obj = doc.toObject();
            delete script_obj.__v;

            return res.json({ status: 200, script: script_obj });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });

}).patch(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(err) {

        return res.json({ status: 400 });
    }

    let params = {};
    params = { ...params, ...(req.body.name === undefined ? {} : { name: req.body.name } ) };
    params = { ...params, ...(req.body.description === undefined ? {} : { description: req.body.description } ) };
    params = { ...params, ...(req.body.thumbnail === undefined ? {} : { thumbnail: req.body.thumbnail } ) };
    params = { ...params, ...(req.body.marketplace_enabled === undefined ? {} : { marketplace_enabled: req.body.marketplace_enabled } ) };

    params = { ...params, ...(req.body.type === undefined ? {} : { type: req.body.type } ) };
    params = { ...params, ...(req.body.match_type === undefined ? {} : { match_type: req.body.match_type } ) };
    params = { ...params, ...(req.body.match === undefined ? {} : { match: req.body.match } ) };

    params = { ...params, ...(req.body.code === undefined ? {} : { code: req.body.code } ) };
    params = { ...params, ...(req.body.data === undefined ? {} : { data: req.body.data } ) };

    if (req.user.admin === true) {

        params = { ...params, ...(req.body.local === undefined ? {} : { local: req.body.local } ) };
        params = { ...params, ...(req.body.featured === undefined ? {} : { featured: req.body.featured } ) };
        params = { ...params, ...(req.body.verified === undefined ? {} : { verified: req.body.verified } ) };
        params = { ...params, ...(req.body.likes === undefined ? {} : { likes: req.body.likes } ) };
        params = { ...params, ...(req.body.guild_count === undefined ? {} : { guild_count: req.body.guild_count } ) };
        params = { ...params, ...(req.body.use_count === undefined ? {} : { use_count: req.body.use_count } ) };
    }

    params = { ...params, ...(req.body.created_with === undefined ? {} : { created_with: req.body.created_with } ) };
    params.updated_at = Date.now();

    schemas.ScriptSchema
        .findById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.author_id !== req.user.discord_id && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            doc
                .update(params)
                .then(() => {

                    return res.json({ status: 200 });
                })
                .catch(err => {

                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(err) {

        return res.json({ status: 400 });
    }

    schemas.ScriptSchema
        .findById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.author_id !== req.user.discord_id && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            doc
                .remove()
                .then(() => {

                    return res.json({ status: 200 });
                })
                .catch(err => {

                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });
});

router.route("/:object_id/likes").post(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(err) {

        return res.json({ status: 400 });
    }

    schemas.ScriptSchema
        .findById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.marketplace_enabled === false && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            let found = false;
            for (let id of req.user.likes) {

                if (id.equals(object_id)) {

                    found = true;
                    break;
                }
            }

            if (found === true) {

                return res.json({ status: 400 });
            }

            doc.likes++;
            doc
                .save()
                .then(() => {

                    req.user.likes.push(object_id);
                    req.user
                        .save()
                        .then(() => {

                            res.json({ status: 200 });
                        })
                        .catch(err => {

                            error(err);
                            return res.json({ status: 500 });
                        });
                })
                .catch(err => {

                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(err) {

        return res.json({ status: 400 });
    }

    schemas.ScriptSchema
        .findById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.marketplace_enabled === false && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            let found = false;
            for (let id of req.user.likes) {

                if (id.equals(object_id)) {

                    found = true;
                    break;
                }
            }

            if (found === false) {

                return res.json({ status: 404 });
            }

            doc.likes--;
            doc
                .save()
                .then(() => {

                    for (let i = 0; i < req.user.likes.length; i++) {
                        if (req.user.likes[i].equals(object_id)) {

                            req.user.likes.splice(i, 1);
                            break;
                        }
                    }
                    req.user
                        .save()
                        .then(() => {

                            res.json({ status: 200 });
                        })
                        .catch(err => {

                            error(err);
                            return res.json({ status: 500 });
                        });
                })
                .catch(err => {

                    error(err);
                    return res.json({ status: 500 });
                });
        })
        .catch(err => {

            error(err);
            return res.json({ status: 500 });
        });
});

module.exports = router;
