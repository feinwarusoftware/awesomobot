"use strict";

const express = require("express");

const schemas = require("../../../db");
const Logger = require("../../../logger");
const { fetchSession, authLogin } = require("../../middlewares");

const router = express.Router();
const apiLogger = new Logger();

router.get("/", fetchSession, authLogin, (req, res) => {

    schemas.UserSchema
    .findOne({
        discord_id: req.session.discord.id
    })
    .then(userdoc => {
        if (userdoc === null) {
            return res.json({ status: 403, message: "Forbidden", error: "User doc not found" });
        }

        if (userdoc.admin === false) {
            return res.json({ status: 403, message: "Forbidden", error: "Admin only path" });
        }

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
    })
    .catch(err => {

        res.json({ status: 500, message: "Internal Server Error", error: err });
    });
});

module.exports = router;
