"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.render("index");
});

router.get("/dashboard/profiles/mattheous", (req, res) => {
    return res.render("profile-admin");
});

module.exports = router;
