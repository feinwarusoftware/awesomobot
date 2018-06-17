"use strict";

const express = require("express");
const router = express.Router();

/* TEMP */

const showdown = require("showdown");
const converter = new showdown.Converter();

//

router.get("/", (req, res) => {

    return res.render("index", { md: text => { return converter.makeHtml(text) } });
});

router.get("/dashboard/profiles/mattheous", (req, res) => {
    return res.render("profile-admin", { md: text => { return converter.makeHtml(text) } });
});

module.exports = router;
