"use strict";

var express = require("express");
var bcryptjs = require("bcryptjs");
var router = express.Router();

var User = require("../../../../common/models/user");

router.route("/")
    .get((req, res) => {
        User.find((err, users) => {
            if (err) {
                res.send(err);
            }

            res.json(users);
        });
    })
    .post((req, res) => {
        var user = new User();
        user.name = req.body.name;
        user.admin = req.body.admin;

        bcryptjs.hash(req.body.password, 10, (err, hash) => {
            user.password = hash;

            user.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ success: true, message: "User added successfully!" });
            });
        });
    });

router.route("/:user_id")
    .get((req, res) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err) {
                res.send(err);
            }

            res.json(user);
        });
    })
    .put((req, res) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err) {
                res.send(err);
            }

            if (req.body.name != undefined) {
                user.name = req.body.name;
            }
            if (req.body.admin != undefined) {
                user.admin = req.body.admin;
            }

            if (req.body.password != undefined) {
                bcryptjs.hash(req.body.password, 10, (err, hash) => {
                    user.password = hash;

                    user.save(err => {
                        if (err) {
                            res.send(err);
                        }

                        res.json({ message: "User updated successfully!" });
                    });
                });
            } else {
                user.save(err => {
                    if (err) {
                        res.send(err);
                    }

                    res.json({ message: "User updated successfully!" });
                });
            }
        });
    })
    .delete((req, res) => {
        User.remove({
            _id: req.params.user_id
        }, (err, user) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "User removed successfully!" });
        });
    });

module.exports = router;
