"use strict";

const fs = require("fs");
const path = require("path");

const crypto = require("crypto");
const axios = require("axios");
const express = require("express");
const showdown = require("showdown");
const jwt = require("jsonwebtoken"); 

const schemas = require("../../db");
const Logger = require("../../logger");
const api = require("./api");
const { authSession, authUser, authAdmin } = require("../middlewares");
const { fetchSession } = require("../helpers");

const apiLogger = new Logger();
const router = express.Router();
const converter = new showdown.Converter();

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

router.use("/api/v3", api);

router.get("/auth/discord", async (req, res) => {

    let session_doc;
    try {

        session_doc = await fetchSession(req.cookies.session);
    } catch(error) {

        // fail silently
        apiLogger.error(error);
    }

    if (session_doc !== undefined && session_doc.complete === true) {
        return res.redirect("/dashboard");
    }

    const nonce = crypto.randomBytes(20).toString("hex");

    const session = new schemas.SessionSchema({
        nonce
    });

    let new_session_doc;
    try {

        new_session_doc = await session.save();
    } catch(error) {

        apiLogger.error(error);
        res.json({ status: 401, message: "Unauthorized", error });
    }

    res.cookie("session", jwt.sign({ id: new_session_doc._id }, config.jwt_secret));
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.discord_id}&redirect_uri=${encodeURIComponent(config.discord_redirect)}&response_type=code&scope=guilds%20identify&state=${nonce}`);
});

router.get("/auth/discord/callback", async (req, res) => {

    let session_doc;
    try {

        session_doc = await fetchSession(req.cookies.session);
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 401, message: "Unauthorized", error });
    }

    if (session_doc.nonce !== req.query.state) {
        return res.json({ status: 401, message: "Unauthorized", error: "Login state was incorrect" });
    }

    let token_res;
    try {

        token_res = await axios({
            method: "post",
            url: `https://discordapp.com/api/oauth2/token?client_id=${config.discord_id}&client_secret=${config.discord_secret}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${encodeURIComponent(config.discord_redirect)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 401, message: "Unauthorized", error });
    }

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${token_res.data.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 401, message: "Unauthorized", error });
    }

    session_doc.discord.access_token = token_res.data.access_token;
    session_doc.discord.token_type = token_res.data.token_type;
    session_doc.discord.expires_in = token_res.data.expires_in;
    session_doc.discord.refresh_token = token_res.data.refresh_token;
    session_doc.discord.scope = token_res.data.scope;

    session_doc.discord.id = user_res.data.id;

    session_doc.nonce = null;
    session_doc.complete = true;

    try {

        await session_doc.save();
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 401, message: "Unauthorized", error });
    }

    res.redirect("/dashboard");
});

router.get("/", (req, res, next) => {

    res.render("index", { md: text => { return converter.makeHtml(text); }, user: {} });
});

router.get("/dashboard", authUser, (req, res, next) => {

    res.send("this is the shitty commands page lol");
});

router.get("/token", authAdmin, (req, res) => {
    
    res.json({ token: req.cookies.session });
});

module.exports = router;
