"use strict";

const fs = require("fs");
const path = require("path");

const express = require("express");
const jwt = require("jsonwebtoken");

const schemas = require("../../../db");
const Logger = require("../../../logger");

const router = express.Router();
const apiLogger = new Logger();

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

// Promise wrapper for jwt.verify().
const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {

        jwt.verify(token, secret, (err, decoded) => {
            if (err !== null && err !== undefined) {

                return reject(err);
            }

            resolve(decoded);
        });
    });
}

// Ensures req.cookies is defined.
const defineCookies = (req, res, next) => {
    if (req.cookies === null || req.cookies === undefined) {
        req.cookies = {};
    }
    next();
}

// Ensures req.session is defined or null.
const nullSession = (req, res, next) => {
    if (req.session === null || req.session === undefined) {
        req.session = null;
    }
    next();
}

// Ensire req.login is defined or null.
const nullLogin = (req, res, next) => {
    if (req.login === null || req.login === undefined) {
        req.login = null;
    }
    next();
}

const fetchSession = (req, res, next) => {
    if (req.cookies.session === undefined && req.headers["xxx-access-token"] === undefined) {
        return next();
    }

    jwtVerify(req.cookies.session === undefined ? req.headers["xxx-access-token"] : req.cookies.session, config.rawrxd).then(decoded => {

        schemas.SessionSchema.findOne({ _id: decoded.id }).then(doc => {
            if (doc === null || doc === undefined) {

                return next();
            }

            req.session = doc;
            next();

        }).catch(err => {

            res.json({ code: 401, err });
        });
    }).catch(err => {

        res.json({ code: 401, err });
    });
}

const fetchLogin = (req, res, next) => {
    if (req.session === null || req.session.discord === null) {
        return next();
    }

    req.login = req.session.discord;
    next();
}

const authLogin = (req, res, next) => {
    if (req.login === null) {
        return res.json({ err: 403 });
    }
    next();
}

router.post("/", defineCookies, nullSession, nullLogin, fetchSession, fetchLogin, (req, res) => {



});

router.route("/:discord_id").get(defineCookies, nullSession, nullLogin, fetchSession, fetchLogin, (req, res) => {

    if (req.login === null) {

        return res.json({ rawrxd: ":mattthink:" });
    }

    res.json({ login: req.login });

}).put((req, res) => {
    


}).patch((req, res) => {
    


}).delete((req, res) => {
    


});

module.exports = router;
