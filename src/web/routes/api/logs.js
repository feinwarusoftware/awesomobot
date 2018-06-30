"use strict";

const express = require("express");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { authAdmin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

const limitDef = 20;
const limitMax = 50;

const pageDef = 0;

router.get("/", authAdmin, async (req, res) => {

    const type = req.query.type === undefined ? null : req.query.type;
    const page =  req.query.page === undefined ? pageDef : req.query.page;

    let limit = req.query.limit === undefined ? limitDef : parseInt(req.query.limit);
    if (isNaN(limit) === true) {
        limit = limitDef;
    }
    if (limit > limitMax) {
        limit = limitMax;
    }

    let log_schemas;
    try {

        log_schemas = await schemas.LogSchema
            .find({
                ...(type === null ? {} : { type })
            })
            .skip(page * limit)
            .limit(limit)
            .select({
                _id: 0,
                __v: 0
            });
    } catch(error) {

        apiLogger.error(error);
        return res.json({ status: 500, message: "Internal Server Error", error });
    }

    if (log_schemas,length === 0) {

    }

    res.json(log_schemas);
});

module.exports = router;
