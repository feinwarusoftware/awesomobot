"use strict"

const express = require("express");
const router = express.Router();
const randomstring = require("randomstring");

const Issue = require("../../../../common/models/issue");

/** ----------------------------------------
 *          GENERAL ISSUE ROUTES
 *  ----------------------------------------
 */
router.route("/")
    .post((req, res) => {
        var issue = new Issue();
        issue.user = req.body.user;
        issue.type = req.body.type;
        issue.desc = req.body.desc;

        issue.save(err => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "issue added successfully!" });
        });
    })
    .get((req, res) => {
        Issue.find((err, issues) => {
            if (err) {
                res.send(err);
            }

            res.json(issues);
        });
    });
router.route("/:issue_id")
    .get((req, res) => {
        Issue.findById(req.params.issue_id, (err, issue) => {
            if (err) {
                res.send(err);
            }

            res.json(issue);
        });
    })
    .put((req, res) => {
        Issue.findById(req.params.issue_id, (err, issue) => {
            if (err) {
                res.send(err);
            }

            issue.user = req.body.user;
            issue.type = req.body.type;
            issue.desc = req.body.desc;

            issue.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "issue updated successfully!" });
            });
        });
    })
    .delete((req, res) => {
        Issue.remove({
            _id: req.params.issue_id
        }, (err, issue) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "issue removed successfully!" });
        });
    });

module.exports = router;