"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.use("/auth", require("./auth"));

router.get("/test", (req, res) => {
    res.render("index");
});

router.get("/info", checkAuth, (req, res) => {
    res.render("info");
});

module.exports = router;