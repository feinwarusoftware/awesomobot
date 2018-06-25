"use strict";

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

const schemas = require("../../db");

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "config.json")));
} catch(err) {

    botLogger.fatalError(`error loading config: ${err}`);
}

router.get("/", (req, res) => {

    res.json({ data: "yay it works!" });
});

// Data search.
router.route("/logs").get((req, res) => {

    // Api key checking.
    /*
    if (req.query.key === undefined || req.query.key !== config.api_key) {

        res.json({ err: "key error" });
        return;
    }
    */

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
        .select("-_id")
        .select("-__v")
        .then(docs => {

            res.json(docs);
        })
        .catch(err => {

            res.json({ err });
        });
});

router.route("/scripts").get((req, res) => {

    const limitDef = 10;
    const limitMax = 25;

    const pageDef = 0;

    const page = req.query.page === undefined ? pageDef : req.query.page;
    let limit = req.query.limit === undefined ? limitDef : parseInt(req.query.limit);
    
    if (isNaN(limit)) {
        limit = limitDef;
    }
    if (limit > limitMax) {
        limit = limitMax;
    }

    const local = req.query.local === undefined ? null : req.query.local === "true";
    const name = req.query.name === undefined ? null : req.query.name;
    //const author = req.query.author === undefined ? null : req.query.author;
    const type = req.query.type === undefined ? null : req.query.type;
    const permissions = req.query.permissions === undefined ? null : req.query.permissions;
    const match = req.query.match === undefined ? null : req.query.match;
    const match_type = req.query.match_type === undefined ? null : req.query.match_type;

    schemas.ScriptSchema
        .find({
            ...(local === null ? {} : { local }),
            ...(name === null ? {} : { name }),
            ...(type === null ? {} : { type }),
            ...(match === null ? {} : { match }),
            ...(match_type === null ? {} : { match_type })
        })
        .skip(page * limit)
        .limit(limit)
        .select("-_id")
        .select("-__v")
        .then(docs => {

            docs = docs.filter(doc => {

                return permissions === null ? true : doc.permissions & permissions;
            });

            res.json(docs);
        })
        .catch(err => {

            res.json({ err });
        });
});

// Data manipulation.
router.route("/guilds/:discord_id").get((req, res) => {


}).post((req, res) => {
    

}).put((req, res) => {
    

}).patch((req, res) => {
    

}).delete((req, res) => {
    

});

router.route("/scripts/:object_id").get((req, res) => {


}).post((req, res) => {
    

}).put((req, res) => {
    

}).patch((req, res) => {
    

}).delete((req, res) => {
    

});

router.route("/users/:discord_id").get((req, res) => {


}).post((req, res) => {
    

}).put((req, res) => {
    

}).patch((req, res) => {
    

}).delete((req, res) => {
    

});

module.exports = router;
