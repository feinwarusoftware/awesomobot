"use strict";

const jwt = require("jsonwebtoken");

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

const checkSessionCookie = (req, res) => {
    if (req.cookies === undefined || req.cookies.session === undefined) {
        return false;
    }
    return true;
}

const addSessionCookie = (req, res, token) => {
    res.cookie("session", token);
}

const remSessionCookie = (req, res) => {
    if (checkSessionCookie(...arguments) === true) {
        res.clearCookie("session");
        req.cookies.session = undefined;
    }
}

const checkSession = (req, res) => {
    if (req.session === undefined || req.session.complete === false) {
        return false;
    }
    return true;
}

const checkUser = (req, res) => {
    if (req.user === undefined) {
        return false;
    }
    return true;
}

module.exports = {

    jwtVerify,

    checkSessionCookie,
    addSessionCookie,
    remSessionCookie,
    checkSession,
    checkUser
};
