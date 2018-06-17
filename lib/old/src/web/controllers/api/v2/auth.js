"use strict";

var express = require("express");
var jwt = require("jsonwebtoken");
var bcryptjs = require("bcryptjs");

var router = express.Router();

var User = require("../../../../common/models/user");

router.post("/", (req, res) => {
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) {
            res.send(err);
        }

        if (!user) {
            res.json({ success: false, message: "Authentication failed. User not found." });
        } else if (user) {

            bcryptjs.compare(req.body.password, user.password, (err, match) => {
                if (match) {
                    const payload = {
                        admin: user.admin
                    };

                    var token = jwt.sign(payload, "temp", {
                        expiresIn: 1440
                    });

                    res.json({
                        success: true,
                        message: "Enjoy your token!",
                        token: token
                    });
                } else {
                    res.json({ success: false, message: "Authentication failed. Incorrect password." });
                }
            });
        }
    });
});

module.exports = router;
