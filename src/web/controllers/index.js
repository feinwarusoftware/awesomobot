"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.use("/auth", require("./auth"));

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/info", checkAuth, (req, res) => {
    res.render("info", { user: req.user });
});

router.get("/nologin", (req, res) => {
    res.render("nologin");
});

module.exports = router;