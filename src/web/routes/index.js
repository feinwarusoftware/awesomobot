"use strict";

const fs = require("fs");
const path = require("path");

const crypto = require("crypto");
const axios = require("axios");
const express = require("express");
const showdown = require("showdown");
const jwt = require("jsonwebtoken"); 
const discord = require("discord.js");

const schemas = require("../../db");
const Logger = require("../../logger");
const api = require("./api");
const { authSession, authUser, authAdmin } = require("../middlewares");
const { fetchSession, getUserData } = require("../helpers");

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

const client = new discord.Client();
const hasLoggedIn = client.login(config.discord_token);

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

const statsCacheTime = 30000;
const cachedStats = {

    expire: Date.now(),
    stats: null
};

router.get("/api/v3/stats", async (req, res) => {

    // total servers
    // total members + online members
    // commands used
    // marketplace commands
    // latest tweet
    // status + ping
    // latest update

    await hasLoggedIn;

    if (cachedStats.expire < Date.now()) {

        cachedStats.stats = {};

        const promises = [];

        // total servers
        cachedStats.stats.servers = client.guilds.size;

        // online + total members
        cachedStats.stats.members = {};
        cachedStats.stats.members.online = client.guilds.map(g => g.members.array()).reduce((a, c) => a = a.concat(c)).filter(m => m.presence.status === "online").length;
        cachedStats.stats.members.total = client.guilds.map(g => g.memberCount).reduce((a, c) => a + c);

        // script uses
        promises.push(schemas.ScriptSchema.aggregate([{
            $group: {
                _id: {},
                total: {
                    $sum: "$use_count"
                }
            }
        }]).then(uses => {

            cachedStats.stats.script_uses = uses[0].total;
        }));

        // total scripts
        promises.push(schemas.ScriptSchema.count().then(count => cachedStats.stats.total_scripts = count));

        // latest tweet
        cachedStats.stats.latest_tweet = {};
        cachedStats.stats.latest_tweet.text = "latest tweet text";
        cachedStats.stats.latest_tweet.date = "latest tweet date";

        // status + ping
        promises.push(axios({
            method: "post",
            url: "https://api.uptimerobot.com/v2/getMonitors",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "api_key": config.uptime_key,
                "all_time_uptime_ratio": "1",
                "response_times": "1",
                "response_times_limit": "1"
            }
        }).then(api_res => {

            cachedStats.stats.status = {};
            cachedStats.stats.status.status = api_res.data.monitors[0].status === 2 ? "OK" : "ERROR";
            cachedStats.stats.status.ping = api_res.data.monitors[0].response_times[0].value;
            cachedStats.stats.status.uptime = api_res.data.monitors[0].all_time_uptime_ratio;
        }));

        // latest update
        cachedStats.stats.latest_update = "latest update text";

        await Promise.all(promises);

        cachedStats.expire = Date.now() + statsCacheTime;
    }

    return res.json({ stats: cachedStats.stats });
});

router.get("/api/v3/patrons", (req, res) => {

    // username
    // avatar
    // date
    // amount

    const patrons = [
        {
            username: "Airborn56",
            avatar: "https://cdn.discordapp.com/avatars/99626024181968896/a_d69fc64082896a7cb51c2aa20557b080.png?size=512",
            date: "2018-04-27T21:32:11.928165+00:00",
            amount: 10
        },
        {
            username: "timmys9inchjimmy",
            avatar: "https://cdn.discordapp.com/avatars/430503118262894614/c016210777c0eed529c6ae9b3a3c7a37.png?size=512",
            date: "2018-06-07T20:54:53.048475+00:00",
            amount: 5
        },
        {
            username: "Kamui",
            avatar: "https://cdn.discordapp.com/avatars/161573813379792899/a_e6cc2fa791bbefce65e928492eaebe91.png?size=512",
            date: "2018-01-03T01:39:37.152671+00:00",
            amount: 1
        },
        {
            username: "KlausHeissler",
            avatar: "https://cdn.discordapp.com/avatars/342086358010953728/1bd96364cbb3ad48df37374b73c6c72c.png?size=512",
            date: "2018-03-03T02:20:43.132314+00:00",
            amount: 1
        },
        {
            username: "lonelychef",
            avatar: "https://cdn.discordapp.com/avatars/328837258788601857/92706e9f3a5342dee38c5279863bf500.png?size=512",
            date: "2018-05-27T10:59:42.665346+00:00",
            amount: 10
        },
        {
            username: "Savagekiller115",
            avatar: "https://cdn.discordapp.com/avatars/393620893835984896/3b1333657ff839838d281bfb02abbec8.png?size=512",
            date: "2018-05-24T00:56:22.462165+00:00",
            amount: 10
        },
        {
            username: "Tweeno",
            avatar: "https://cdn.discordapp.com/avatars/215982178046181376/79209171354b0d6a28f2c5672b1d5bbd.png?size=512",
            date: "2018-06-16T00:00:00.000000+00:00",
            amount: 1
        }
    ];

    return res.json(patrons);
});

router.get("/api/v3/stats", (req, res) => {

    const guilds = client.guilds.array();

    let memberCount = 0;
    for (let i = 0; i < guilds.length; i++) {

        memberCount += guilds[i].members.array().length;
    }

    return res.json({ guilds: guilds.length, members: memberCount });
});

router.get("/api/v3/sloc", (req, res) => {

    return res.json({ code: 0 });
});

router.get("/dashboard/profiles/:discord_id", authUser, async (req, res) => {

    res.render("dashboard/profile")
});     

router.get("/logout", async (req, res) => {
   
    let session_doc;

    // if the cookie exists, attempt to fetch the users session
    if (req.cookies !== undefined && req.cookies.session !== undefined) {

        try {

            session_doc = await fetchSession(req.cookies.session);
        } catch(error) {

            // fail silently
            apiLogger.error(error);
        }
    }

    // the user was logged in
    if (session_doc !== undefined && session_doc.complete === true) {
        
        // log the user out
        try {

            await session_doc.remove();
        } catch(error) {

            return res.json({ message: "error loggin out", error });
        }
    }

    // redirect to home page to show successful log out
    return res.redirect("/");
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
        res.render("401", { status: 401, message: "Unauthorized", error });
    }

    res.cookie("session", jwt.sign({ id: new_session_doc._id }, config.jwt_secret), { maxAge: 604800000, httpOnly: true });
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.discord_id}&redirect_uri=${encodeURIComponent(config.discord_redirect)}&response_type=code&scope=guilds%20identify&state=${nonce}`);
});

router.get("/auth/discord/callback", async (req, res) => {

    let session_doc;
    try {

        session_doc = await fetchSession(req.cookies.session);
    } catch(error) {

        apiLogger.error(error);
        return res.render("401", { status: 401, message: "Unauthorized", error });
    }

    if (session_doc.nonce !== req.query.state) {
        return res.render("401", { status: 401, message: "Unauthorized", error: "Login state was incorrect" });
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
        return res.render("401", { status: 401, message: "Unauthorized", error });
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
        return res.render("401", { status: 401, message: "Unauthorized", error });
    }

    session_doc.discord.access_token = token_res.data.access_token;
    session_doc.discord.token_type = token_res.data.token_type;
    session_doc.discord.expires_in = token_res.data.expires_in;
    session_doc.discord.refresh_token = token_res.data.refresh_token;
    session_doc.discord.scope = token_res.data.scope;

    session_doc.discord.id = user_res.data.id;

    // remove all dead sessions with the same discord_id
    let userData;
    try {

        userData = await getUserData(token_res.data.access_token);
    } catch(error) {

        apiLogger.error(error);
        return res.render("401", { status: 401, message: "Unauthorized", error });
    }

    try {

        await schemas.SessionSchema
            .find({
                "discord.id": userData.id
            })
            .then(async sessions => {

                for (let i = 0; i < sessions.length; i++) {

                    await sessions[i].remove();
                }
            });

    } catch(error) {

        apiLogger.error(error);
        return res.render("401", { status: 401, message: "Unauthorized", error });
    }

    session_doc.nonce = null;
    session_doc.complete = true;

    try {

        await session_doc.save();
    } catch(error) {

        apiLogger.error(error);
        return res.render("401", { status: 401, message: "Unauthorized", error });
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
    let credits;
    try {
    
        credits = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "credits.json")));
    } catch (err) {
    
        apiLogger.fatalError(`Could not read config file: ${err}`);
    }
    res.render("credits", { md: text => { return converter.makeHtml(text); }, user: {}, credits:credits});
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

/*
router.get("/dashboard/scripts/editor", authUser, (req, res) => {
    res.render("dashboard/editor");
});
*/

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

router.get("/dashboard/leaderboards/legacy/v1", authUser, async (req, res) => {

    let v1;
    try {
    
        v1 = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "v1.json")));
    } catch (err) {
    
        apiLogger.fatalError(`Could not read config file: ${err}`);
    }

    res.render("dashboard/legacy-leaderboards", {v1:v1});
});

router.get("/dashboard/leaderboards/legacy/v2", authUser, async (req, res) => {

    let v2;
    try {
    
        v2 = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "v2.json")));
    } catch (err) {
    
        apiLogger.fatalError(`Could not read config file: ${err}`);
    }
    res.render("dashboard/legacy-leaderboards-2", {v2:v2});
});

router.get("/dashboard/leaderboards", authUser, (req, res) => {

    res.render("dashboard/leaderboards");
});

router.get("/dashboard/scripts/editor/advanced", authUser, (req, res) => {

    res.render("dashboard/userscripts");
});

router.get("/dashboard/scripts/editor/basic", authUser, (req, res) => {

    res.render("dashboard/userscripts-basic");
});

router.get("/dashboard/scripts/manager", authUser, (req, res) => {

    res.render("dashboard/scriptmanager");
});

router.get("/dashboard/patrons", authUser, (req, res) => {

    res.render("dashboard/patrons");
});

router.get("/dragonsplayroom", authUser, (req, res) => {

    res.render("dumbshit/dragonsplayroom");
});

router.get("/token", authAdmin, (req, res) => {
    
    res.render("token", { token: req.cookies.session });
});

module.exports = router;
