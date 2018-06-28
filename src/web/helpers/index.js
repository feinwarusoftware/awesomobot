"use strict";

const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");

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

                    return reject("User doc not found");
                }

                resolve(user_doc);
            })
            .catch(error => {

                apiLogger.error(error);
                reject(error);
            });
    });
}

module.exports = {

    jwtVerify,
    fetchSession,
    fetchUser
};
