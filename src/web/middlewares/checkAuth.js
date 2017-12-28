"use strict"

const express = require("express");
const router = express.Router();

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.send("not logged in :(");
}

module.exports = checkAuth;