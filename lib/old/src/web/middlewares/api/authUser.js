"use strict";

var express = require("express");
var jwt = require("jsonwebtoken");
const router = express.Router();

function authUser(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
        jwt.verify(token, "temp", (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: "Failed to authenticate token." });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: "No token provided."
        });
    }
}

module.exports = authUser;
