"use strict"

const express = require("express");
const router = express.Router();

const Server = require("../../common/models/server");

router.get("/", (req, res) => {
    res.render("dashboard/select", { user: req.user });
});

router.get("/:server_id", (req, res) => {
    
    Server.findById(req.params.server_id, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/index", { user: req.user, server: server });
    });
});

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

module.exports = router;