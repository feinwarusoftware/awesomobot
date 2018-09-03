"use strict";

const express = require("express");
//const axios = require("axios");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authUser, authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

router.route("/").post(authAdmin, (req, res) => {

    const params = {};
    params.discord_id = req.body.discord_id;
    params.prefix = req.body.prefix;
    params.log_channel_id = req.body.log_channel_id;
    params.log_events = req.body.log_events;
    params.scripts = [];

    const guild = new schemas.GuildSchema(params);

    guild
        .save()
        .then(() => {

            return res.json({ status: 200 });
        })
        .catch(error => {

            apiLogger.error(error);
            return res.json({ status: 500 });
        });
});

router.route("/@me").get(authUser, (req, res) => {

    // + cond discord data
    
    res.json({ status: 410 });
});

router.route("/:discord_id").get(authUser, (req, res) => {

    // + cond discord data

    res.json({ status: 410 });

}).patch(authUser, (req, res) => {

    res.json({ status: 410 });

}).delete(authUser, (req, res) => {

    res.json({ status: 410 });
});

router.route("/:discord_id/scripts").get(authUser, (req, res) => {

    // + cond script data

    res.json({ status: 410 });

}).post(authUser, (req, res) => {

    res.json({ status: 410 });
});

router.route("/:discord_id/scripts/:object_id").get(authUser, (req, res) => {

    // + cond script data

    res.json({ status: 410 });

}).patch(authUser, (req, res) => {

    res.json({ status: 410 });

}).delete(authUser, (req, res) => {

    res.json({ status: 410 });
});

module.exports = router;
