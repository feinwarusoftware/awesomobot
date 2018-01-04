"use strict";

var express = require("express");
var authUser = require("../../../middlewares/api/authUser");
var authAdmin = require("../../../middlewares/api/authAdmin");
var router = express.Router();

var Report = require("../../../../common/models/report");

router.route("/")
    .get(authUser, (req, res) => {
        Report.find((err, reports) => {
            if (err) {
                res.send(err);
            }

            res.json(reports);
        });
    })
    .post(authAdmin, (req, res) => {
        var report = new Report();
        report.user = req.body.user;
        report.type = req.body.type;
        report.desc = req.body.desc;

        report.save(err => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Report added successfully!" });
        });
    });

router.route("/:report_id")
    .get(authUser, (req, res) => {
        Report.findById(req.params.report_id, (err, report) => {
            if (err) {
                res.send(err);
            }

            res.json(report);
        });
    })
    .put(authAdmin, (req, res) => {
        Report.findById(req.params.report_id, (err, report) => {
            if (err) {
                res.send(err);
            }

            if (req.body.user != undefined) {
                report.user = req.body.user;
            }
            if (req.body.type != undefined) {
                report.type = req.body.type;
            }
            if (req.body.desc != undefined) {
                report.desc = req.body.desc;
            }

            report.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Report updated successfully!" });
            });
        });
    })
    .delete(authAdmin, (req, res) => {
        Report.remove({
            _id: req.params.report_id
        }, (err, report) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Report removed successfully!" });
        });
    });

module.exports = router;
