"use strict";

const express = require("express");

const schemas = require("../../../db");
const { authUser, authAdmin } = require("../../middlewares");
const { getUserData, getUserDataNoSession } = require("../../helpers");

const router = express.Router();
const { log: { info, warn, error } } = require("../../../utils");

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

const defaultValue = (param, def) => {

    return param === undefined ? def : param;
}

router.route("/").get(authUser, (req, res) => {

    // + cond discord data
    const extended = req.query.extended === "true" ? true : req.query.extended === "false" ? false : undefined;

    const current = req.query.extended === "true" ? true : req.query.extended === "false" ? false : false; 

    const sort_dir = req.query.reversed === "true" ? 1 : req.query.reversed === "false" ? -1 : -1;
    const sort = {
        ...( req.query.order === undefined ? { [req.query.order]: -1 } : { [req.query.order]: sort_dir } )
    }

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
        ...( req.query.admin === undefined ? {} : { admin: req.query.admin } ),
        ...( req.query.verified === undefined ? {} : { verified: req.query.verified } ),
        ...( req.query.developer === undefined ? {} : { developer: req.query.developer } ),
        ...( req.query.tier === undefined ? {} : { tier: req.query.tier } )
    };

    const promises = [];
    
    promises.push(schemas.UserSchema.count(search));
    promises.push(schemas.UserSchema.find(search).skip(page * limit).limit(limit).sort(sort).select({ __v: 0, _id: 0 }));
    
    Promise.all(promises).then(data => {

        return res.json({ status: 200, page, limit, total: data[0], users: data[1], ...( current === false ? {} : { current: req.user } ) });

    }).catch(error => {

        error(error);
        return res.json({ status: 500 });
    });

}).post(authAdmin, (req, res) => {

    const params = {};
    params.discord_id = req.body.discord_id;

    params.banner = req.body.banner;
    params.bio = req.body.bio;
    params.socials = req.body.socials;
    params.modules = req.body.modules;

    if (req.user.admin === true) {

        params.admin = req.body.admin;
        params.verified = req.body.verified;
        params.developer = req.body.developer;
        params.tier = req.body.tier;
        params.premium = req.body.premium;

        params.xp = req.body.xp;
        params.shits = req.body.shits;
        params.trophies = req.body.trophies;

        params.likes = req.body.likes;
    }
    
    const user = new schemas.UserSchema(params);

    user
        .save()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(error => {

            error(error);
            return res.json({ status: 500 });
        });
});

router.route("/@me").get(authUser, (req, res) => {

    // + cond discord data
    const extended = req.query.extended === "true" ? true : req.query.extended === "false" ? false : undefined;

    getUserData(req.session.discord.access_token)
        .then(user => {

            const user_obj = req.user.toObject();

            delete user_obj.__v;
            delete user_obj._id;

            if (extended === true) {

                user_obj.username = user.username;
                user_obj.locale = user.locale;
                user_obj.mfa_enabled = user.mfa_enabled;
                user_obj.avatar = user.avatar;
                user_obj.discriminator = user.discriminator;
            }

            return res.json({ status: 200, user: user_obj });
        })
        .catch(error => {

            error(error);
            return res.json({ status: 500 });
        });
});

router.route("/:discord_id").get(authUser, (req, res) => {

    // + cond discord data
    const extended = req.query.extended === "true" ? true : req.query.extended === "false" ? false : undefined;

    schemas.UserSchema
        .findOne({
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            const user_obj = doc.toObject();

            delete user_obj.__v;
            delete user_obj._id;

            if (extended === true) {

                getUserDataNoSession(req.params.discord_id)
                    .then(async user => {
                
                        user_obj.username = user.username;
                        //user_obj.locale = user.locale;
                        //user_obj.mfa_enabled = user.mfa_enabled;
                        user_obj.avatar = user.avatar;
                        //user_obj.discriminator = user.discriminator;
            
                        return res.json({ status: 200, user: user_obj });
                    })
                    .catch(error => {

                        error(error);
                        return res.json({ status: 500 });
                    })
            } else {

                return res.json({ status: 200, user: user_obj });
            }
        })
        .catch(error => {

            error(error);
            return res.json({ status: 500 });
        });

}).patch(authUser, (req, res) => {

    if (req.params.discord_id !== req.user.discord_id) {

        return res.json({ status: 403 });
    }
    
    req.user.banner = req.body.banner === undefined ? req.user.banner : req.body.banner;
    req.user.bio = req.body.bio === undefined ? req.user.bio : req.body.bio;
    req.user.socials = req.body.socials === undefined ? req.user.socials : req.body.socials;
    req.user.modules = req.body.modules === undefined ? req.user.modules : req.body.modules;

    if (req.user.admin === true) {

        req.user.admin = req.body.admin === undefined ? req.user.admin : req.body.admin;
        req.user.verified = req.body.verified === undefined ? req.user.verified : req.body.verified;
        req.user.developer = req.body.developer === undefined ? req.user.developer : req.body.developer;
        req.user.tier = req.body.tier === undefined ? req.user.tier : req.body.tier;
        req.user.premium = req.body.premium === undefined ? req.user.premium : req.body.premium;

        req.user.xp = req.body.xp === undefined ? req.user.xp : req.body.xp;
        req.user.shits = req.body.shits === undefined ? req.user.shits : req.body.shits;
        req.user.trophies = req.body.trophies === undefined ? req.user.trophies : req.body.trophies;

        req.user.likes = req.body.likes === undefined ? req.user.likes : req.body.likes;
    }

    req.user
        .save()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(error => {

            error(error);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {
    
    if (req.params.discord_id !== req.user.discord_id) {

        return res.json({ status: 403 });
    }

    req.user
        .remove()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(error => {

            error(error);
            return res.json({ status: 500 });
        });
});

module.exports = router;
