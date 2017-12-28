"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

module.exports = router;