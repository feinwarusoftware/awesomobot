"use strict";

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

/*
{
    expire,
    data
}
*/
const userCache = {};

const cacheTime = 30000;

const getUserData = token => {
    return new Promise((resolve, reject) => {

        let data = null;
        for (let k in userCache) {
    
            if (userCache[k].expire < Date.now()) {
    
                delete userCache[k];
                continue;
            }
    
            if (k === token) {
    
                data = userCache[k].data;
            }
        }
    
        if (data === null) {
    
            axios
                .get("https://discordapp.com/api/v6/users/@me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(res => {

                    userCache[token] = {

                        expire: new Date(Date.now() + cacheTime),
                        data: res.data 
                    };
        
                    resolve(res.data);
                })
                .catch(error => {
        
                    reject(error);
                });
        } else {
    
            resolve(data);
        }
    });
}

router.route("/").post(authAdmin, (req, res) => {

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

            apiLogger.error(error);
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

            apiLogger.error(error);
            return res.json({ status: 500 });
        })
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

            const user_obj = req.user.toObject();

            delete user_obj.__v;
            delete user_obj._id;

            if (extended === true) {

                schemas.SessionSchema
                    .find({
                        "discord.id": req.params.discord_id
                    })
                    .then(async docs => {
                        if (docs.length === 0) {

                            return res.json({ status: 404 });
                        }

                        let user = null;
                        let success = false;
                        for (let doc of docs) {

                            if (success === true) {

                                break;
                            }

                            try {

                                user = await getUserData(doc.discord.access_token);
                                success = true;
                            } catch(error) {

                                user = null;
                                success = false;
                            }
                        }

                        if (success === false) {

                            return res.json({ status: 400 });
                        }

                
                        user_obj.username = user.username;
                        //user_obj.locale = user.locale;
                        //user_obj.mfa_enabled = user.mfa_enabled;
                        user_obj.avatar = user.avatar;
                        //user_obj.discriminator = user.discriminator;
            
                        return res.json({ status: 200, user: user_obj });
                    })
                    .catch(error => {

                        apiLogger.error(error);
                        return res.json({ status: 500 });
                    })
            } else {

                return res.json({ status: 200, user: user_obj });
            }
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).patch(authUser, async (req, res) => {
    


}).delete(authUser, async (req, res) => {
    

});

module.exports = router;
