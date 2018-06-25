"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({

    //  _id: ObjectId,
    discord: {
        nonce: String,
        access_token: String,
        token_type: String,
        expires_in: String,
        refresh_token: String,
        scope: String,
    }
});

module.exports = mongoose.model("Session", SessionSchema);
