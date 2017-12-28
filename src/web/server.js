"use strict"

const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const Strategy = require("passport-discord").Strategy;
const port = process.env.WEBSERVER_PORT || 3000;
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
        clientID: "372462428690055169",
        clientSecret: "0wPt1HDKNVs7Su6uTzDMCAb-oZUmTjHi",
        callbackURL: "http://localhost:4000/auth/discord/callback",
        scope: ["identify", "guilds"]
        
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            return done(null, profile);
        });
    }));

    // Express settings.
    app.use(logger("dev"));
    app.set("views", __dirname + "/views");
    app.engine("pug", require("pug").__express);
    app.set("view engine", "pug");

    app.use(express.static(__dirname + "/public"));
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
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