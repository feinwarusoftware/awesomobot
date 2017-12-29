"use strict"

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("dashboard/index", { user: req.user });
});

router.get("/stats", (req, res) => {
    res.render("dashboard/stats", { user: req.user });
});

router.get("/leaderboards", (req, res) => {
    res.render("dashboard/leaderboards", { user: req.user });
});

router.get("/moderation", (req, res) => {
    res.render("dashboard/moderation", { user: req.user });
});

router.get("/developer", (req, res) => {
    res.render("dashboard/developer", { user: req.user });
});

router.get("/music", (req, res) => {
    res.render("dashboard/music", { user: req.user });
});

router.get("/games", (req, res) => {
    res.render("dashboard/games", { user: req.user });
});

router.get("/integrations", (req, res) => {
    res.render("dashboard/integrations", { user: req.user });
});

module.exports = router;