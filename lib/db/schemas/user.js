"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

    // _id: ObjectId,
    discordId: { type: String, required: true, unique: true },
    scripts: [Schema.Types.ObjectId],
    members: [{
        // _id: ObjectId,
        guild: Schema.Types.ObjectId,
        data: [{
            index: false
        }]
    }],
    data: [{
        index: false
    }]
});

module.exports = mongoose.model("User", userSchema);
