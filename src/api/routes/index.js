"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

    res.json({ data: "yay it works!" });
});

module.exports = router;
