"use strict";

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

const defaultValue = (param, def) => {

    return param === undefined ? def : param;
}

/*
{
    expire,
    data
}
*/
const guildCache = {};

const cacheTime = 30000;

const getUserGuilds = token => {
    return new Promise((resolve, reject) => {

        let data = null;
        for (let k in guildCache) {
    
            if (guildCache[k].expire < Date.now()) {
    
                delete guildCache[k];
                continue;
            }
    
            if (k === token) {
    
                data = guildCache[k].data;
            }
        }
    
        if (data === null) {
    
            axios
                .get("https://discordapp.com/api/v6/users/@me/guilds", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(res => {

                    guildCache[token] = {

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
    params.prefix = req.body.prefix;
    params.log_channel_id = req.body.log_channel_id;
    params.log_events = req.body.log_events;
    params.scripts = [];

    const guild = new schemas.GuildSchema(params);

    guild
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
    
    // 
    const owner = req.query.owner === "true" ? true : req.query.owner === "false" ? false : undefined;

    getUserGuilds(req.session.discord.access_token)
        .then(guilds => {

            const search_ids = [];
            for (let guild of guilds) {
                if ((guild.name.includes(name === undefined ? "" : name) === true) && (owner === undefined ? true : guild.owner === owner)) {

                    search_ids.push(guild.id);
                }
            }

            schemas.GuildSchema
                .count({
                    discord_id: {
                        $in: search_ids
                    }
                })
                .skip(page * limit)
                .limit(limit)
                .then(total => {
                    if (total === 0) {

                        return res.json({ status: 404 });
                    }

                    schemas.GuildSchema
                        .find({
                            discord_id: {
                                $in: search_ids
                            }
                        })
                        .skip(page * limit)
                        .limit(limit)
                        .select({
                            __v: 0,
                            _id: 0,
                            scripts: 0
                        })
                        .then(docs => {

                            if (extended === true) {

                                docs = docs.map(doc => {

                                    const doc_obj = doc.toObject();

                                    for (let guild of guilds) {

                                        if (guild.id === doc_obj.discord_id) {

                                            doc_obj.owner = guild.owner;
                                            doc_obj.permissions = guild.permissions;
                                            doc_obj.icon = guild.icon;
                                            //doc.id = guild.id;
                                            doc_obj.name = guild.name;
                                            
                                            break;
                                        }
                                    }

                                    return doc_obj;
                                });
                            }
                
                            return res.json({ status: 200, page, limit, total, guilds: docs });
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

router.route("/:discord_id").get(authUser, (req, res) => {

    schemas.GuildSchema
        .findOne({ 
            discord_id: req.params.discord_id
        })
        .select({
            __v: 0,
            _id: 0,
            scripts: 0
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            return res.json({ status: 200, guild: doc });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).patch(authUser, (req, res) => {

    const params = {};
    params.prefix = req.body.prefix;
    params.log_channel_id = req.body.log_channel_id;
    params.log_events = req.body.log_events;

    schemas.GuildSchema
        .findOne({
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            getUserGuilds(req.session.discord.access_token)
                .then(guilds => {
        
                    const current_guild = guilds.find(e => {
        
                        return e.id === req.params.discord_id;
                    });

                    if (current_guild === undefined || (current_guild.owner === false && ((current_guild.permissions & 0b1000) !== 0b1000))) {
        
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
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });

}).delete(authUser, (req, res) => {

    schemas.GuildSchema
        .findOne({
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            getUserGuilds(req.session.discord.access_token)
                .then(guilds => {
        
                    const current_guild = guilds.find(e => {
        
                        return e.id === req.params.discord_id;
                    });

                    if (current_guild === undefined || (current_guild.owner === false && ((current_guild.permissions & 0b1000) !== 0b1000))) {
        
                        return res.json({ status: 403 });
                    }

                    doc
                        .remove()
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
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

router.route("/:discord_id/scripts").get(authUser, (req, res) => {

    // + cond script data
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
        ...( req.query.marketplace_enabled === undefined ? { } : { marketplace_enabled: req.query.marketplace_enabled } ),
        ...( req.query.name === undefined ? {} : { name: { $regex: `.*${req.query.name}.*` } } )
    };

    schemas.GuildSchema
    .findOne({
        discord_id: req.params.discord_id
    })
    .then(doc => {
        if (doc === null) {

            return res.json({ status: 404 });
        }

        if (extended === true) {

            const search_ids = doc.scripts.map(script => script.object_id);

            schemas.ScriptSchema
                .count({
                    ...search,
                    _id: {
                        $in: search_ids
                    }
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
                            _id: {
                                $in: search_ids
                            }
                        })
                        .skip(page * limit)
                        .limit(limit)
                        .select({ __v: 0 })
                        .then(docs => {

                            docs = docs.map(doc2 => {

                                const doc2_obj = doc2.toObject();

                                for (let script of doc.scripts) {

                                    if (script.object_id.equals(doc2_obj._id)) {

                                        delete doc2_obj._id;

                                        doc2_obj.object_id = script.object_id;
                                        doc2_obj.match_type_override = script.match_type_override;
                                        doc2_obj.match_override = script.match_override;
                                        doc2_obj.permissions = script.permissions;
                                        
                                        break;
                                    }
                                }

                                return doc2_obj;
                            });
                
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
        } else {

            return res.json({ status: 200, page, limit, total: doc.scripts.length, scripts: doc.scripts.slice(page * limit, page * limit + limit) });
        }
    })
    .catch(error => {

        apiLogger.error(error);
        return res.json({ status: 500 });
    });

}).post(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.body.object_id);
    } catch(error) {

        return res.json({ status: 400 });
    }

    const params = {
        ...( req.query.match_type_override === undefined ? {} : { match_type_override: req.query.match_type_override } ),
        ...( req.query.match_override === undefined ? {} : { match_override: req.query.match_override } ),
        ...( req.query.permissions === undefined ? {} : { permissions: req.query.permissions } )
    };

    schemas.GuildSchema
        .findOne({ 
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            schemas.ScriptSchema
                .findById(object_id)
                .then(doc2 => {
                    if (doc2 === null) {

                        return res.json({ status: 400 });
                    }

                    getUserGuilds(req.session.discord.access_token)
                        .then(guilds => {
                
                            const current_guild = guilds.find(e => {
                
                                return e.id === req.params.discord_id;
                            });
        
                            if (current_guild === undefined || (current_guild.owner === false && ((current_guild.permissions & 0b1000) !== 0b1000))) {
                
                                return res.json({ status: 403 });
                            }
        
                            const script = new schemas.GuildScriptSchema({
                                ...params,
                                object_id
                            });
        
                            doc.scripts.push(script);
        
                            doc
                                .save()
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

router.route("/:discord_id/scripts/:object_id").get(authUser, (req, res) => {

    let object_id;
    try {

        object_id = mongoose.Types.ObjectId(req.params.object_id);
    } catch(error) {

        return res.json({ status: 400 });
    }

    schemas.GuildSchema
        .findOne({ 
            discord_id: req.params.discord_id
        })
        .select({
            __v: 0,
            _id: 0
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            const script = doc.scripts.find(e => {

                return e.object_id.equals(object_id);
            });

            if (script === undefined) {

                return res.json({ status: 404 });
            }

            return res.json({ status: 200, script });
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
    params.match_type_override = req.body.match_type_override;
    params.match_override = req.body.match_override;
    params.permissions = req.body.permissions;

    schemas.GuildSchema
        .findOne({ 
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            getUserGuilds(req.session.discord.access_token)
                .then(guilds => {
        
                    const current_guild = guilds.find(e => {
        
                        return e.id === req.params.discord_id;
                    });

                    if (current_guild === undefined || (current_guild.owner === false && ((current_guild.permissions & 0b1000) !== 0b1000))) {
        
                        return res.json({ status: 403 });
                    }

                    let found = false;
                    for (let i = 0; i < doc.scripts.length; i++) {

                        if (doc.scripts[i].object_id.equals(object_id)) {

                            found = true;

                            doc.scripts[i].match_type_override = params.match_type_override === undefined ? doc.scripts[i].match_type_override : params.match_type_override; 
                            doc.scripts[i].match_override = params.match_override === undefined ? doc.scripts[i].match_override : params.match_override; 
                            doc.scripts[i].permissions = params.permissions === undefined ? doc.scripts[i].permissions : params.permissions; 

                            break;
                        }
                    }

                    if (found === false) {

                        return res.json({ status: 404 });
                    }

                    doc
                        .save()
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

    schemas.GuildSchema
        .findOne({ 
            discord_id: req.params.discord_id
        })
        .then(doc => {
            if (doc === null) {

                return res.json({ status: 404 });
            }

            getUserGuilds(req.session.discord.access_token)
                .then(guilds => {
        
                    const current_guild = guilds.find(e => {
        
                        return e.id === req.params.discord_id;
                    });

                    if (current_guild === undefined || (current_guild.owner === false && ((current_guild.permissions & 0b1000) !== 0b1000))) {
        
                        return res.json({ status: 403 });
                    }

                    let found = false;
                    for (let i = 0; i < doc.scripts.length; i++) {
        
                        if (doc.scripts[i].object_id.equals(object_id)) {
        
                            found = true;
        
                            doc.scripts.splice(i, 1);
        
                            break;
                        }
                    }
        
                    if (found === false) {
        
                        return res.json({ status: 404 });
                    }
        
                    doc
                        .save()
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
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

module.exports = router;
