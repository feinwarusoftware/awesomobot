"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/dashboard", checkAuth, require("./dashboard"));

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/dashboard", checkAuth, (req, res) => {
    res.render("dashboard", { user: req.user });
});

router.get("/nologin", (req, res) => {
    res.render("nologin");
});

module.exports = router;