"use strict";

const express = require("express");

const schemas = require("../../../db");

const router = express.Router();

router.get("/", (req, res) => {

    const limitDef = 20;
    const limitMax = 50;

    const pageDef = 0;

    const page = req.query.page === undefined ? pageDef : req.query.page;
    let limit = req.query.limit === undefined ? limitDef : parseInt(req.query.limit);
    
    if (isNaN(limit)) {
        limit = limitDef;
    }
    if (limit > limitMax) {
        limit = limitMax;
    }

    const type = req.query.type === undefined ? null : req.query.type;

    schemas.LogSchema
        .find({
            ...(type === null ? {} : { type })
        })
        .skip(page * limit).limit(limit)
        .select({
            _id: 0,
            __v: 0
        })
        .then(docs => {

            res.json(docs);
        })
        .catch(err => {

            res.json({ err });
        });
});

module.exports = router;
