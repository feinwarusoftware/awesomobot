"use strict"

const express = require("express");
const router = express.Router();

// Server specific routes.
router.use("/servers", require("./servers"));

module.exports = router;