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

const apiLogger = new Logger();
const router = express.Router();
const converter = new showdown.Converter();

const getUserData = token => {
    return new Promise((resolve, reject) => {

        axios({
            method: "get",
            url: "https://discordapp.com/api/v6/users/@me",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {

            res.data.time = Date.now();
            resolve(res.data);
        }).catch(err => {

            reject(err);
        });
    });
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
    if (req.cookies === undefined || req.cookies.session === undefined) {
        return next();
    }

    jwtVerify(req.cookies.session, config.rawrxd).then(decoded => {

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

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    apiLogger.fatalError(`Could not read config file: ${err}`);
}

router.use("/api/v3", api);

router.get("/auth/discord", defineCookies, nullSession, nullLogin, fetchSession, fetchLogin, (req, res) => {

    if (req.login !== null) {
        
        return res.redirect("/dashboard");
    }

    const nonce = crypto.randomBytes(20).toString("hex");

    const session = new schemas.SessionSchema({
        nonce
    });

    session.save().then(doc => {

        const token = jwt.sign({ id: doc._id }, config.rawrxd);
        res.cookie("session", token);
        res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.id}&redirect_uri=${encodeURIComponent(config.redirect)}&response_type=code&scope=guilds%20identify&state=${nonce}`);

    }).catch(err => {

        res.json({ code: 401, err });
    });
});

router.get("/auth/discord/callback", defineCookies, nullSession, nullLogin, fetchSession, (req, res) => {

    if (req.query.state !== req.session.nonce) {
        res.json({ code: 401 });
        return;
    }

    axios({
        method: "post",
        url: `https://discordapp.com/api/oauth2/token?client_id=${config.id}&client_secret=${config.secret}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${encodeURIComponent(config.redirect)}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(discord => {

        req.session.discord.access_token = discord.data.access_token;
        req.session.discord.token_type = discord.data.token_type;
        req.session.discord.expires_in = discord.data.expires_in;
        req.session.discord.refresh_token = discord.data.refresh_token;
        req.session.discord.scope = discord.data.scope;

        req.session.save().then(doc => {

            res.redirect("/dashboard");
        }).catch(err => {

            res.json({ code: 401, err });
        });
    }).catch(err => {

        res.json({ code: 401, err });
    });
});

router.get("/", defineCookies, nullSession, nullLogin, fetchSession, fetchLogin, async (req, res, next) => {

    let user = null;

    if (req.login !== null) {

        user = await getUserData(req.login.access_token);
        if (user === null) {
            return;
        }
    }

    res.render("index", { md: text => { return converter.makeHtml(text); }, user });
});

router.get("/dashboard", defineCookies, nullSession, nullLogin, fetchSession, fetchLogin, authLogin, (req, res, next) => {

    res.send("this is the shitty commands page lol");
});

/*
const fs = require("fs");
const path = require("path");

const commandsfile = fs.readFileSync(path.join(__dirname, "..", "translations", "commands", "commands.json"));
const commands = JSON.parse(commandsfile);
*/

/*
router.get("/",  async (req, res) => {

    /*
    if (req.session.discord_login !== null && req.session.discord_login !== undefined) {
        
        if (req.session.userData === null || req.session.userData === undefined || (Date.now() - req.session.userData.time) / 1000 > 300) {

            req.session.userData = await getUserData(req.session.discord_login.access_token);
            if (req.session.userData === null) {

                res.status(500).send("Error getting user info.");
                return;
            }
        }

        res.render("index", { md: text => { return converter.makeHtml(text); }, user: req.session.userData });

    } else {

        res.render("index", { md: text => { return converter.makeHtml(text); }, user: null });
    }


    res.render("index", { md: text => { return converter.makeHtml(text); }, user: null });
});
*/

// /commands

/*
router.get("/commands", async (req, res) => {

    if (req.session.discord_login !== null && req.session.discord_login !== undefined) {
        
        if (req.session.userData === null || req.session.userData === undefined || (Date.now() - req.session.userData.time) / 1000 > 300) {

            req.session.userData = await getUserData(req.session.discord_login.access_token);
            if (req.session.userData === null) {

                res.status(500).send("Error getting user info.");
                return;
            }
        }

        res.render("commands", { md: text => { return converter.makeHtml(text); }, user: req.session.userData});

    } else {

        res.render("commands", { md: text => { return converter.makeHtml(text); }, user: null});
    }
});

// /dashboard

router.get("/dashboard/profiles/mattheous", (req, res) => {
    return res.render("profile-admin", { md: text => { return converter.makeHtml(text); } });
});
*/

/* -------------------------- */
/* >>> DISCORD LOGIN SHIT <<< */
/* -------------------------- */

/*
router.get("/auth/discord", (req, res) => {

    const state = crypto.randomBytes(20).toString("hex");

    req.session.nonce = state;

    res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=372462428690055169&redirect_uri=http%3A%2F%2F81.156.215.77%3A80%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=guilds%20identify&state="+state);
    return;
});

router.get("/auth/discord/callback", (req, res) => {

    if (req.session.nonce === null || req.session.nonce === undefined) {
        res.status(500).send("Error logging in.");
        return;
    }

    if (req.query.code === null || req.query.code === undefined) {
        res.status(500).send("Error logging in.");
        return;
    }

    if (req.session.nonce !== req.query.state) {
        res.status(500).send("Error logging in.");
        return;
    }

    req.session.nonce = null;

    axios({
        method: "post",
        url: "https://discordapp.com/api/oauth2/token?client_id=372462428690055169&client_secret=e-GgLn0Ndv9LJc1jupdpsk1zNGPy4g4U&grant_type=authorization_code&code="+req.query.code+"&redirect_uri=http%3A%2F%2F81.156.215.77%3A80%2Fauth%2Fdiscord%2Fcallback",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(res2 => {

        req.session.discord_login = res2.data;
        res.redirect("/dashboard");
        return;
    }).catch(err => {

        res.status(500).send("Error logging in.");
        return;
    });
});
*/

/*
router.get("/auth/discord/me", (req, res) => {
    
    if (!req.session.token.access_token) {
        return res.status(500).send("Error logging in.");
    }
    axios({
        method: "get",
        url: "https://discordapp.com/api/v6/users/@me",
        headers: {
            "Authorization": "Bearer "+req.session.token.access_token
        }
    }).then(res2 => {
        req.session.user = res2.data;
        return res.redirect("/");
    }).catch(err => {
        return res.status(500).send("Error logging in.");
    });
});
*/

/* -------------------------- */
/*        >>> END <<<         */
/* -------------------------- */

module.exports = router;
