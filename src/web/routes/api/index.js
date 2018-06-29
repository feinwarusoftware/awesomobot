"use strict";

const express = require("express");

//const guilds = require("./guilds");
const logs = require("./logs");
//const scripts = require("./scripts");
const users = require("./users");

const router = express.Router();

//router.use("/guilds", guilds);
router.use("/logs", logs);
//router.use("/scripts", scripts);
router.use("/users", users);

module.exports = router;
