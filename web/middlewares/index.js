"use strict";

const { fetchSession, fetchUser } = require("../helpers");

const authSession = (req, res, next) => {

    let token;

    if (req.cookies !== undefined && req.cookies.session !== undefined) {
        token = req.cookies.session;
    }

    if (req.headers["xxx-access-token"] !== undefined) {
        token = req.headers["xxx-access-token"];
    }

    if (token === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(token)
        .then(session_doc => {

            if (session_doc.complete === false) {
                return res.json({ status: 401, message: "Unauthorized", error: "Your session was in an incorrect state" });
            }

            req.session = session_doc;
            next();
        })
        .catch(err => {

            res.json({ status: 401, message: "Unauthorized", err });
        });
}

const authUser = (req, res, next) => {

    let token;

    if (req.cookies !== undefined && req.cookies.session !== undefined) {
        token = req.cookies.session;
    }

    if (req.headers["xxx-access-token"] !== undefined) {
        token = req.headers["xxx-access-token"];
    }

    if (token === undefined) {
        //return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
        return res.redirect("/auth/discord");
    }

    fetchSession(token)
        .then(session_doc => {

            if (session_doc.complete === false) {
                return res.json({ status: 401, message: "Unauthorized", error: "Your session was in an incorrect state" });
            }

            req.session = session_doc;

            fetchUser(session_doc.discord.id)
                .then(user_doc => {

                    req.user = user_doc
                    next();
                })
                .catch(err => {

                    //return res.json({ status: 401, message: "Unauthorized", err });
                    return res.redirect("/auth/discord");
                });
        })
        .catch(err => {

            //res.json({ status: 401, message: "Unauthorized", err });
            return res.redirect("/auth/discord");
        });
}

const authPremium = (req, res, next) => {

    let token;

    if (req.cookies !== undefined && req.cookies.session !== undefined) {
        token = req.cookies.session;
    }

    if (req.headers["xxx-access-token"] !== undefined) {
        token = req.headers["xxx-access-token"];
    }

    if (token === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(token)
        .then(session_doc => {

            if (session_doc.complete === false) {
                return res.json({ status: 401, message: "Unauthorized", error: "Your session was in an incorrect state" });
            }

            req.session = session_doc;

            fetchUser(session_doc.discord.id)
                .then(user_doc => {

                    if (user_doc.tier === "free") {
                        return res.json({ status: 403, message: "Forbidden", error: "You are not authorised to access this path" });
                    }

                    req.user = user_doc
                    next();
                })
                .catch(err => {

                    return res.json({ status: 401, message: "Unauthorized", err });
                });
        })
        .catch(err => {

            res.json({ status: 401, message: "Unauthorized", err });
        });
}

const authAdmin = (req, res, next) => {

    let token;

    if (req.cookies !== undefined && req.cookies.session !== undefined) {
        token = req.cookies.session;
    }

    if (req.headers["xxx-access-token"] !== undefined) {
        token = req.headers["xxx-access-token"];
    }

    if (token === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(token)
        .then(session_doc => {

            if (session_doc.complete === false) {
                return res.json({ status: 401, message: "Unauthorized", error: "Your session was in an incorrect state" });
            }

            req.session = session_doc;

            fetchUser(session_doc.discord.id)
                .then(user_doc => {

                    if (user_doc.admin === false) {
                        return res.json({ status: 403, message: "Forbidden", error: "You are not authorised to access this path" });
                    }

                    req.user = user_doc
                    next();
                })
                .catch(err => {

                    return res.json({ status: 401, message: "Unauthorized", err });
                });
        })
        .catch(err => {

            res.json({ status: 401, message: "Unauthorized", err });
        });
}

module.exports = {

    authSession,
    authUser,
    authPremium,
    authAdmin
};
