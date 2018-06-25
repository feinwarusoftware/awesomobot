"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({

    //  _id: ObjectId,
    discord: {
        access_token: { type: String, required: true },
        token_type: { type: String, required: true },
        expires_in: { type: String, required: true },
        refresh_token: { type: String, required: true },
        scope: { type: String, required: true }
    }
});

module.exports = mongoose.model("Session", SessionSchema);
