"use strict";

const { fetchSession, fetchUser } = require("../helpers");

const authSession = (req, res, next) => {

    if (req.cookies === undefined || req.cookies.session === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(req.cookies.session)
        .then(session_doc => {

            if (session_doc.complete === false) {
                return res.json({ status: 401, message: "Unauthorized", error: "Your session was in an incorrect state" });
            }

            req.session = session_doc;
            next();
        })
        .catch(error => {

            res.json({ status: 401, message: "Unauthorized", error });
        });
}

const authUser = (req, res, next) => {

    if (req.cookies === undefined || req.cookies.session === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(req.cookies.session)
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
                .catch(error => {

                    return res.json({ status: 401, message: "Unauthorized", error });
                });
        })
        .catch(error => {

            res.json({ status: 401, message: "Unauthorized", error });
        });
}

const authAdmin = (req, res, next) => {

    if (req.cookies === undefined || req.cookies.session === undefined) {
        return res.json({ status: 401, message: "Unauthorized", error: "There was an issue fetching your session" });
    }

    fetchSession(req.cookies.session)
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
                .catch(error => {

                    return res.json({ status: 401, message: "Unauthorized", error });
                });
        })
        .catch(error => {

            res.json({ status: 401, message: "Unauthorized", error });
        });
}

module.exports = {

    authSession,
    authUser,
    authAdmin
};
