"use strict";

var express = require("express");
var authUser = require("../../../middlewares/api/authUser");
var authAdmin = require("../../../middlewares/api/authAdmin");
var router = express.Router();

var Server = require("../../../../common/models/server");

router.route("/")
    .get(authUser, (req, res) => {
        Server.find((err, servers) => {
            if (err) {
                res.send(err);
            }

            res.json(servers);
        });
    })
    .post(authAdmin, (req, res) => {
        var server = new Server();
        server._id = req.body._id;
        server.members = req.body.members;
        server.issues = req.body.issues;
        server.graphs = req.body.graphs;
        server.stats = req.body.stats;

        server.save(err => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server added successfully!" });
        });
    });

router.route("/:server_id")
    .get(authUser, (req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server);
        });
    })
    .put(authAdmin, (req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            if (req.body.members != undefined) {
                server.members = req.body.members;
            }
            if (req.body.issues != undefined) {
                server.issues = req.body.issues;
            }
            if (req.body.graphs != undefined) {
                server.graphs = req.body.graphs;
            }
            if (req.body.stats != undefined) {
                server.stats = req.body.stats;
            }

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Server updated successfully!" });
            });
        });
    })
    .delete(authAdmin, (req, res) => {
        Server.remove({
            _id: req.params.server_id
        }, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server removed successfully!" });
        });
    });

module.exports = router;
