"use strict";

const fs = require("fs");
const path = require("path");

const schemas = require("../../db");
const Logger = require("../../logger");
const { jwtVerify, checkSessionCookie, checkSession, checkUser } = require("../helpers");

const apiLogger = new Logger();

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

/*
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

const fetchUser = (req, res, next) => {
    schemas.UserSchema
        .findOne({
            discord_id: req.session.discord.id
        })
        .then(userdoc => {
            if (userdoc === null) {
                return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
            }

            req.user = userdoc;
            next();

        })
        .catch(err => {

            res.json({ status: 500, message: "Internal Server Error", error: err });
        });
}

const authAdmin = (req, res, next) => {
    if (req.user !== undefined && req.user.admin === true) {
        return next();
    }
    res.json({ status: 403, message: "Forbidden", error: "Admin only path" });
}

module.exports = {

    fetchSession,
    authLogin,
    fetchUser,
    authAdmin
};
*/

const fetchSession = token => {

    jwtVerify(token, config.jwt_secret)
        .then(decoded => {

            schemas.SessionSchema
                .findById(decoded.id)
                .then(session_doc => {
                    if (session_doc === null) {

                        return { session_doc: null, error: "Session doc not found" };
                    }

                    return { session_doc, error: null };
                })
                .catch(error => {

                    return { session_doc: null, error };
                });
        })
        .catch(error => {

            return { session_doc: null, error };
        });
}

const fetchUser = discord_id => {

    schemas.UserSchema
        .findOne({
            discord_id
        })
        .then(user_doc => {
            if (user_doc === null) {

                return { user_doc: null, error: "User doc not found" };
            }

            return { user_doc, error: null };
        })
        .catch(error => {

            return { user_doc: null, error };
        });
}

const authSession = (req, res, next) => {

    
}

const authUser = (req, res, next) => {

}

const authAdmin = (req, res, next) => {

}

module.exports = {

    authSession,
    authUser,
    authAdmin
};
