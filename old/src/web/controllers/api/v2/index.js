"use strict";

var express = require("express");
var authUser = require("../../../middlewares/api/authUser");
var authAdmin = require("../../../middlewares/api/authAdmin");
var router = express.Router();

var auth = require("./auth");

var users = require("./users");
var servers = require("./servers");
var reports = require("./reports");

// Api authentication.
router.use("/auth", auth);

// ++ check api auth
router.use("/users"/*, authAdmin*/, users);
router.use("/servers", servers);
router.use("/reports", reports);

module.exports = router;
