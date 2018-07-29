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
const converter = new showdown.Converter({
    tables: true,
    emoji: true,
    customizedHeaderId: true,
    ghCodeBlocks: true
});

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

router.use("/api/v3", api);
router.get("/api/v3/uptime", (req, res) => {

    axios({
        method: "post",
        url: "https://api.uptimerobot.com/v2/getMonitors",
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "api_key": config.uptime_key,
            "all_time_uptime_ratio": "1"
        }
    }).then(api_res => {

        return res.json({ uptime: api_res.data.monitors[0].all_time_uptime_ratio });

    }).catch(error => {

        return res.json({ rip: "fucking rip" });
    });
});
router.get("/api/v3/patrons", (req, res) => {

    axios({
        method: "get",
        url: "https://www.patreon.com/api/oauth2/api/campaigns/1430518/pledges?include=patron.null",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.patreon_key}`
        }
    }).then(api_res => {

        const promises = [];

        for (let i = 0; i < api_res.data.included.length; i++) {

            let promise;

            if (api_res.data.included[i].attributes.social_connections.discord === null) {

                promise = new Promise((resolve, reject) => resolve({ data: null }));

            } else {
   
                promise = axios({
                    method: "get",
                    url: `https://discordapp.com/api/v6/users/${api_res.data.included[i].attributes.social_connections.discord.user_id}`,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bot ${config.discord_token}`
                    }
                });
            }

            promises.push(promise);
        }

        Promise.all(promises).then(users => {

            const info = [];

            for (let i = 0; i < users.length; i++) {

                let username = users[i].data === null ? "undefined" : users[i].data.username;
                let avatar = users[i].data === null ? `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png` : `https://cdn.discordapp.com/avatars/${users[i].data.id}/${users[i].data.avatar}.png?size=512`;

                info.push({

                    username,
                    avatar,
                    date: api_res.data.data[i].attributes.created_at,
                    amount: api_res.data.data[i].attributes.amount_cents / 100
                });
            }

            return res.json(info);

        }).catch(error => {

            return res.json({ oof: "mega oof" });
        });

    }).catch(error => {

        return res.json({ rip: "fucking rip" });
    });
});

router.get("/auth/discord", async (req, res) => {

    let session_doc;
    if (req.cookies !== undefined && req.cookies.session !== undefined) {

        try {

            session_doc = await fetchSession(req.cookies.session);
        } catch(error) {

            // fail silently
            apiLogger.error(error);
        }
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

    res.cookie("session", jwt.sign({ id: new_session_doc._id }, config.jwt_secret), config.rawrxd, { maxAge: 604800, expire: new Date() + 604800, secure: true });
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

router.get("/", (req, res) => {

    res.render("index", { md: text => { return converter.makeHtml(text); }, user: {} });
});

router.get("/api/docs", async (req, res) => {
    const apidocs = fs.readFileSync(path.join(__dirname, "..", "markdown",  "api-docs", "reference.md")).toString();
    res.render("apidocs", { md: text => { return converter.makeHtml(text); }, user: {}, apidocs});
});

router.get("/privacy", async (req, res) => {
    const privacy = fs.readFileSync(path.join(__dirname, "..", "markdown", "terms", "privacy.md")).toString();
    res.render("privacy", { md: text => { return converter.makeHtml(text); }, user: {}, privacy});
});

router.get("/credits", async (req, res) => {
    res.render("credits", { md: text => { return converter.makeHtml(text); }, user: {}});
});

router.get("/commands", (req, res) => {
    res.render("commands", { md: text => { return converter.makeHtml(text); }, user: {}});
});

router.get("/surveys", (req, res) => {
    res.render("surveys", { md: text => { return converter.makeHtml(text); }, user: {}});
});

router.get("/surveys/results", (req, res) => {
    res.render("survey-results", { md: text => { return converter.makeHtml(text); }, user: {}});
});

router.get("/premium", (req, res) => {
    const premium = fs.readFileSync(path.join(__dirname, "..", "markdown", "premium", "premium.md")).toString();
    res.render("premium", { md: text => { return converter.makeHtml(text); }, user: {}, premium});
});

router.get("/premium/checkout", (req, res) => {
    res.render("premiumcheckout", { md: text => { return converter.makeHtml(text); }, user: {}});
});

router.get("/dashboard", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dashboard/main", { user_data: user_res.data });
});

router.get("/dashboard/scripts/editor", authUser, (req, res) => {
    res.render("dashboard/editor");
});

router.get("/dashboard/scripts/marketplace", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dashboard/marketplace", { user_data: user_res.data });
});

router.get("/dashboard/scripts/me", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dashboard/userscripts", { user_data: user_res.data });
});

router.get("/dashboard/scripts/manager", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dashboard/scriptmanager", { user_data: user_res.data });
});

router.get("/dashboard/patrons/getawesomo", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dashboard/patron-steps", { user_data: user_res.data });
});

router.get("/dragonsplayroom", authUser, async (req, res) => {

    let user_res;
    try {

        user_res = await axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${req.session.discord.access_token}`
            }
        });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ error: "error fetching discord data lol" });
    }

    res.render("dumbshit/dragonsplayroom", { user_data: user_res.data });
});

router.get("/dragonsplayroompp", authUser, (req, res) => {

    res.render("dumbshit/dragonsplayroompp");
});

router.get("/token", authAdmin, (req, res) => {
    
    res.json({ token: req.cookies.session });
});

module.exports = router;
