"use strict"

const express = require("express");
const router = express.Router();
// Server specific routes.
router.use("/servers", require("./servers"));
// issue specific routes.
router.use("/issues", require("./issues"));
module.exports = router;