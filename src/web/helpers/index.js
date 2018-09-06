"use strict";

const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const schemas = require("../../db");
const Logger = require("../../logger");

const apiLogger = new Logger();

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

// Promise wrapper for jwt.verify().
const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {

        jwt.verify(token, secret, (err, decoded) => {
            if (err === null) {
                return resolve(decoded);
            }

            reject(err);
        });
    });
}

const fetchSession = token => {
    return new Promise((resolve, reject) => {

        jwtVerify(token, config.jwt_secret)
            .then(decoded => {

                schemas.SessionSchema
                    .findById(decoded.id)
                    .then(session_doc => {
                        if (session_doc === null) {

                            return reject("Session doc not found");
                        }

                        resolve(session_doc);
                    })
                    .catch(error => {

                        apiLogger.error(error);
                        reject(error);
                    });
            })
            .catch(error => {

                apiLogger.error(error);
                reject(error);
            });
    });
}

const fetchUser = discord_id => {
    return new Promise((resolve, reject) => {

        schemas.UserSchema
            .findOne({
                discord_id
            })
            .then(user_doc => {
                if (user_doc === null) {

                    const new_user_doc = new schemas.UserSchema({
                        discord_id
                    });

                    // admin defaults
                    for (let id of config.admins) {
                        if (id === discord_id) {
                            new_user_doc.admin = true;
                            break;
                        }
                    }

                    new_user_doc
                        .save()
                        .then(new_user_doc => {
                            if (new_user_doc === null) {

                                return reject("Error on user creation");
                            }

                            resolve(new_user_doc);
                        })
                        .catch(error => {
                            
                            apiLogger.error(error);
                            reject(error);
                        });
                } else {

                    resolve(user_doc);
                }
            })
            .catch(error => {

                apiLogger.error(error);
                reject(error);
            });
    });
}

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

module.exports = {

    jwtVerify,
    fetchSession,
    fetchUser,

    getUserData
};
