"use strict"

const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/discord", passport.authenticate("discord", {
    scope: ["identify", "guilds"]
}));

router.get("/discord/callback", passport.authenticate("discord", {
    successRedirect: "/info",
    failureRedirect: "/"
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;