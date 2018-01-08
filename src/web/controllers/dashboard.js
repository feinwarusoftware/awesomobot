"use strict"

const express = require("express");
const router = express.Router();

const Server = require("../../common/models/server");

router.get("/", (req, res) => {

    if (req.user.currentGuild) {
        res.redirect("/dashboard/home");
        return;
    }

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

router.get("/home/:server_id", (req, res) => {

    req.user.currentGuild = req.params.server_id;
    res.redirect("/dashboard/home");
});

router.get("/home", (req, res) => {

    if (!req.user.currentGuild) {
        res.send("You need to select a server first!");
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/home", { user: req.user, server: server });
    });
});

/*
router.get("/", (req, res) => {

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

router.get("/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/index", { user: req.user, server: server });
    });
});

// TESTING
router.get("/graph/:server_id", (req, res) => {

    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/graph", { user: req.user, server: server, test: 101 });
    });
});
//

router.get("/stats/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/stats", { user: req.user, server: server });
    });
});

router.get("/leaderboards/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/leaderboards", { user: req.user, server: server });
    });
});

router.get("/moderation/:server_id", (req, res) => {

    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/moderation", { user: req.user, server: server });
    });
});

router.get("/developer/:server_id", (req, res) => {
   
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/developer", { user: req.user, server: server });
    });
});

router.get("/music/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/music", { user: req.user, server: server });
    });
});

router.get("/games/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/games", { user: req.user, server: server });
    });
});

router.get("/integrations/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/integrations", { user: req.user, server: server });
    });
});
*/

module.exports = router;