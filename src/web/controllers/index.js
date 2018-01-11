"use strict"

const express = require("express");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

// DEPRECATED
router.use("/api/v1", require("./api/v1"));

// Rest api routes.
//router.use("/api/v2", require("./api/v2/index"));

// Auth routes.
router.use("/auth", require("./auth"));

// Dashboard routes en.
router.use("/dashboard", checkAuth, require("./dashboard"));
// Dashboard routes other lang. (note to self: this wont work!)
//router.use("/:lang/dashboard", checkAuth, require("./dashboard"));

//router.use("/wiki", checkAuth, require("./wiki"));

// Homepage en.
router.get("/", (req, res) => {
    res.render("index");
});

const langs = ["es", "fr", "it", "pl", "pt", "ie"];
// Homepage other lang.
router.get("/:lang", (req, res, next) => {

    const found = langs.find(e => {
        return e == req.params.lang;
    });
    if (found == undefined) {
        return next();
    } else {
        res.render("index-" + req.params.lang);
    }
});

// Status en.
router.get("/status", (req, res) => {
    res.render("status");
});

const commands = [
    {
        name: "shitme",
        desc: "Counts how many times you have said 'shit'",
        usage: "-shitme",
        roles: ["@everyone"]
    },
    {
        name: "shitlist",
        desc: "Lists the top 5 people who have said 'shit' and displays the total amount from the server",
        usage: "-shitlist",
        roles: ["@everyone"]
    },
    {
        name: "avatar",
        desc: "Displays a full res version of your avatar. (Mostly used for development purposes)",
        usage: "-avatar",
        roles: ["@everyone"]
    },
    {
        name: "wiki",
        desc: "Does a South Park wiki search",
        usage: "-w <search term>",
        roles: ["@everyone"]
    },
    {
        name: "random",
        desc: "Displays a random episode",
        usage: "-random",
        roles: ["@everyone"]
    },
    {
        name: "botinfo",
        desc: "Displays info about AWESOM-O",
        usage: "-botinfo",
        roles: ["@everyone"]
    },
    {
        name: "sub",
        desc: "Sends a link to the subreddit",
        usage: "-sub",
        roles: ["@everyone"]
    },
    {
        name: "microaggression",
        desc: "Microaggression, Hit 'em!",
        usage: "-micro OR -microaggression",
        roles: ["@everyone"]
    },
    {
        name: "reminder",
        desc: "Don't forget to bring a towel!",
        usage: "-reminder",
        roles: ["@everyone"]
    },
    {
        name: "welcome",
        desc: "Welcomes to the server",
        usage: "-welcome",
        roles: ["@everyone"]
    },
    {
        name: "pay respects",
        desc: "Press 'F' to pay respects",
        usage: "-f",
        roles: ["@everyone"]
    },
    {
        name: "times",
        desc: "Displays the time in different timezones",
        usage: "-times",
        roles: ["@everyone"]
    },
    {
        name: "addfp",
        desc: "You join the Freedom Pals",
        usage: "-addfp",
        roles: ["@New Kid"]
    },
    {
        name: "removefp",
        desc: "You leave the Freedom Pals",
        usage: "-removefp",
        roles: ["@Freedom Pals"]
    },
    {
        name: "addcf",
        desc: "You join Coon & Friends",
        usage: "-addcf",
        roles: ["@New Kid"]
    },
    {
        name: "removecf",
        desc: "You leave Coon & Friends",
        usage: "-removefp",
        roles: ["@Coon & Friends"]
    },
    {
        name: "addcm",
        desc: "You join Butters and his Chaos Minions",
        usage: "-addcm",
        roles: ["@New Kid"]
    },
    {
        name: "removecm",
        desc: "You leave Butters and his Chaos Minions",
        usage: "-removecm",
        roles: ["@Chaos Minions"]
    },
    {
        name: "addpc",
        desc: "You join the PC Bros. PC stands for Pussy Crushers by the way",
        usage: "-addpc",
        roles: ["@New Kid"]
    },
    {
        name: "removepc",
        desc: "You leave the PC Bros",
        usage: "-removepc",
        roles: ["@PC Bros"]
    },
    {
        name: "fuckyourself",
        desc: "Just your usual mod abuse commands",
        usage: "-fuckyourself",
        roles: ["@Hallway Monitors"]
    },
    {
        name: "dick",
        desc: "Just your usual mod abuse commands",
        usage: "-dick",
        roles: ["@Hallway Monitors"]
    },
    {
        name: "fuckyou",
        desc: "Just your usual mod abuse commands",
        usage: "-fuckyou",
        roles: ["@Hallway Monitors"]
    },
];

// Command 'wiki'
router.get("/commands", (req, res) => {
    res.render("commands", { commands: commands });
});

// Markdown test.
const markdown = require("markdown").markdown;
const content = "#testing...";
router.get("/md", (req, res) => {

    res.render("md", { markdown: markdown, content: content });
});

module.exports = router;
