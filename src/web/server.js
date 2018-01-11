"use strict"

const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const ejs = require("ejs");

const config = require("../../config");

const Strategy = require("passport-discord").Strategy;
const port = config.port;
const app = express();

function start() {
    // Passport setup.
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(new Strategy({
        clientID: config.clientid,
        clientSecret: config.secret,
        callbackURL: "http://" + config.address + port + "/auth/discord/callback",
        scope: ["identify", "guilds"]
        
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            return done(null, profile);
        });
    }));

    // Express settings, plz no change, order matters!.
    app.use(logger("dev"));
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");

    app.use(express.static(__dirname + "/public"));
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require("./controllers"));

    // Start the webserver.
    app.listen(port, () => {
        console.log("Magic happens on port: " + port);
    });
}

module.exports = start;