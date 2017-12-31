"use strict"

const express = require("express");
const router = express.Router();

const Server = require("../../common/models/server");

// server routes
router.route("/servers")
    .post((req, res) => {
        var server = new Server();
        server._id = req.body._id;

        server.save(err => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server added successfully!" });
        });
    })
    .get((req, res) => {
        Server.find((err, servers) => {
            if (err) {
                res.send(err);
            }

            res.json(servers);
        });
    });
router.route("/servers/:server_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server);
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            server.issues = req.body.issues;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Server updated successfully!" });
            });
        });
    })
    .delete((req, res) => {
        Server.remove({
            _id: req.params.server_id
        }, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server removed successfully!" });
        });
    });

router.route("/servers/:server_id/issues")
    .post((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            console.log(server);

            const issues = server.issues;

            issues.push({
                author: req.body.author,
                name: req.body.name,
                tag: req.body.tag,
                desc: req.body.desc
            });

            server.issues = issues;

            server.save(err => {
                if (err) {
                    res.send(err);
                }
    
                res.json({ message: "Issue added successfully!" });
            });
        });
    })
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server.issues);
        });
    });

/*
    <th>Created By</th>
    <th>Name of Issue</th>
    <th>Category</th>
    <th>Description</th>
*/

module.exports = router;