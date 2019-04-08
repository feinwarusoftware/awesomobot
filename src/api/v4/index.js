"use strict";

const router = require("express").Router();

const errors = require("./errors");

router.use(errors);

module.exports = router;
