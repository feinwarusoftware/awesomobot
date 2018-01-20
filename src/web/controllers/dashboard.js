"use strict"

const express = require("express");
const rquest = require("../../bot/rquest");
const bot = require("../../bot/main");
const router = express.Router();

const Server = require("../../common/models/server");

router.get("/", (req, res, next) => {

    var queries = [];
    for (var i = 0; i < req.user.guilds.length; i++) {
        queries.push(Server.findById(req.user.guilds[i].id));
    }

    Promise.all(queries).then(servers => {
        
        for (var i = 0; i < servers.length; i++) {
            req.user.guilds[i].bot = false;
            if (servers[i] != null) {
                req.user.guilds[i].bot = true;
            }
        }

        res.render("dashboard/select", { user: req.user });
    });
});

router.get("/home", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        rquest.performRequest("discordapp.com", "/api/guilds/" + req.user.currentGuild + "/widget.json", "GET", {}, (data) => {

            res.render("dashboard/", { user: req.user, server: server, online: data.members.length });
        });
    });
});

router.get("/developer", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/developer", { user: req.user, server: server });
    });
});

router.get("/games", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/games", { user: req.user, server: server });
    });
});

router.get("/leaderboards", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/leaderboards", { user: req.user, server: server });
    });
});

router.get("/moderation", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    const guild = req.user.guild.find(e => {
        return e.id == req.user.currentGuild;
    });
    if (!guild) {
        res.send("Error: the devs fucked up! Blame !Dragon1320 for this.");
    }
    if (!guild.perms & 32) {
        res.send("Mods only beyond this point!");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/moderation", { user: req.user, server: server });
    });
});

router.get("/music", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/music", { user: req.user, server: server });
    });
});

router.get("/stats", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/stats", { user: req.user, server: server });
    });
});

router.get("/:server_id", (req, res, next) => {

    if (parseInt(req.params.server_id)) {

        req.user.currentGuild = req.params.server_id;
        res.redirect("/dashboard/home");
    } else {

        return next();
    }
});

module.exports = router;