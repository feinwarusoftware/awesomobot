"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

// Rest api routes.
router.use("/api/v1", require("./api"));

// Auth routes.
router.use("/auth", require("./auth"));

// Dashboard routes en.
router.use("/dashboard", checkAuth, require("./dashboard"));
// Dashboard routes other lang.
router.use("/:lang/dashboard", checkAuth, require("./dashboard"));

// Homepage en.
router.get("/", (req, res) => {
    res.render("index");
});
// Homepage other lang.
router.get("/:lang", (req, res) => {
    res.render("index-" + req.params.lang);
});

module.exports = router;