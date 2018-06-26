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

// Retrieves a session from the database.
const fetchSession = (req, res, next) => {

    let token = null;

    if (req.cookies !== undefined && req.cookies.session !== undefined) {
        token = req.cookies.session;
    }

    if (req.headers["xxx-access-token"] !== undefined) {
        token = req.headers["xxx-access-token"];
    }

    if (token === null) {
        return next();
    }

    jwtVerify(token, config.rawrxd).then(decoded => {

        schemas.SessionSchema.findOne({ _id: decoded.id }).then(doc => {
            if (doc === null) {
                return next();
            }

            req.session = doc;
            next();

        }).catch(err => {

            res.json({ status: 401, message: "Unauthorized", error: err });
        });
    }).catch(err => {

        res.json({ status: 401, message: "Unauthorized", error: err });
    });
}

// Checks if the user is logged in.
const authLogin = (req, res, next) => {
    if (req.session !== undefined && req.session.discord.id !== null) {
        return next();
    }
    res.json({ status: 403, message: "Forbidden", error: null });
}

module.exports = {

    fetchSession,
    authLogin
};
