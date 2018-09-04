"use strict";

const express = require("express");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

const defaultValue = (param, def) => {

    return param === undefined ? def : param;
}

router.route("/").get(authUser, (req, res) => {

    // Parse the amount of scripts that the api will return.
    let limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
        limit = defaultSearchLimit;
    }
    limit = Math.min(limit, maxSearchLimit);

    // Parse the current page of scripts that the api will return.
    const page = defaultValue(req.query.page, defaultSearchPage);

    // Parse the name seperately as it will be a 'contains' filter.
    const name = req.query.name;

    // Parse other search parameters. Add only the allowed parameters into a new search object.
    const search = {};
    search.local = req.query.local;
    search.verified = req.query.verified;
    search.featured = req.query.featured;

    // Only return marketplace enabled scripts.
    search.marketplace_enabled = req.user.admin === false ? true : req.query.marketplace_enabled;

    schemas.ScriptSchema
        .count({
            ...search,
            ...(name === undefined ? {} : {
                name: {
                    $regex: `.*${name}.*`
                }
            })
        })
        .skip(page * limit)
        .limit(limit)
        .then(total => {
            if (total === 0) {

                return res.json({ status: 404 });
            }

            schemas.ScriptSchema
                .find({
                    ...search,
                    ...(name === undefined ? {} : {
                        name: {
                            $regex: `.*${name}.*`
                        }
                    })
                })
                .skip(page * limit)
                .limit(limit)
                .select({ __v: 0 })
                .then(docs => {
        
                    return res.json({ status: 200, page, limit, total, scripts: docs });
                })
                .catch(error => {
        
                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).post(authUser, (req, res) => {

    const params = {};
    params.name = req.body.name;
    params.description = req.body.description;
    params.thumbnail = req.body.thumbnail;
    params.marketplace_enabled = req.body.marketplace_enabled;

    params.type = req.body.type;
    params.match_type = req.body.match_type;
    params.match = req.body.match;

    params.code = req.body.code;
    params.data = req.body.data;

    if (req.user.admin === true) {

        params.local = req.body.local;
        params.featured = req.body.featured;
        params.verified = req.body.verified;
        params.likes = req.body.likes;
        params.guild_count = req.body.guild_count;
        params.use_count = req.body.use_count;
    }

    params.created_with = req.body.created_with;
    params.updated_at = Date.now();
    
    const script = new schemas.ScriptSchema(params);

    script
        .save()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(error => {

            apiLogger.error(error);
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

    // Parse the name seperately as it will be a 'contains' filter.
    const name = req.query.name;

    // Parse other search parameters. Add only the allowed parameters into a new search object.
    const search = {};
    search.local = req.query.local;
    search.verified = req.query.verified;
    search.featured = req.query.featured;

    schemas.ScriptSchema
        .count({
            _id: req.user._id,
            ...search,
            ...(name === undefined ? {} : {
                name: {
                    $regex: `.*${name}.*`
                }
            })
        })
        .skip(page * limit)
        .limit(limit)
        .then(total => {
            if (total === 0) {

                return res.json({ status: 404 });
            }

            schemas.ScriptSchema
                .find({
                    _id: req.user._id,
                    ...search,
                    ...(name === undefined ? {} : {
                        name: {
                            $regex: `.*${name}.*`
                        }
                    })
                })
                .skip(page * limit)
                .limit(limit)
                .select({ __v: 0 })
                .then(docs => {
        
                    return res.json({ status: 200, page, limit, total, scripts: docs });
                })
                .catch(error => {
        
                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

router.route("/:object_id").get(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

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
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).patch(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400 });
    }

    const params = {};
    params.name = req.body.name;
    params.description = req.body.description;
    params.thumbnail = req.body.thumbnail;
    params.marketplace_enabled = req.body.marketplace_enabled;

    params.type = req.body.type;
    params.match_type = req.body.match_type;
    params.match = req.body.match;

    params.code = req.body.code;
    params.data = req.body.data;

    if (req.user.admin === true) {

        params.local = req.body.local;
        params.featured = req.body.featured;
        params.verified = req.body.verified;
        params.likes = req.body.likes;
        params.guild_count = req.body.guild_count;
        params.use_count = req.body.use_count;
    }

    params.created_with = req.body.created_with;
    params.updated_at = Date.now();

    schemas.ScriptSchema
        .findOneById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.author_id.equals(req.user._id) === false && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            doc
                .update(params)
                .then(() => {

                    return res.json({ status: 200 });
                })
                .catch(error => {

                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {
    
    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400 });
    }

    schemas.ScriptSchema
        .findOneById(object_id)
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            if (doc.author_id.equals(req.user._id) === false && req.user.admin === false) {

                return res.json({ status: 403 });
            }

            doc
                .delete()
                .then(() => {

                    return res.json({ status: 200 });
                })
                .catch(error => {

                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

router.route("/:object_id/likes").post(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

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

            if (req.user.likes.includes(object_id) === true) {

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
                        .catch(error => {

                            apiLogger.error(error);
                            return res.json({ status: 500 });
                        });
                })
                .catch(error => {

                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

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

            if (req.user.likes.includes(object_id) === false) {

                return res.json({ status: 404 });
            }

            doc.likes--;
            doc
                .save()
                .then(() => {

                    for (let i = 0; i < req.user.likes.length; i++) {
                        if (req.user.likes[i].equals(object_id)) {

                            req.user.likes.splice(i, 1);
                            return;
                        }
                    }
                    req.user
                        .save()
                        .then(() => {

                            res.json({ status: 200 });
                        })
                        .catch(error => {

                            apiLogger.error(error);
                            return res.json({ status: 500 });
                        });
                })
                .catch(error => {

                    apiLogger.error(error);
                    return res.json({ status: 500 });
                });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

module.exports = router;
