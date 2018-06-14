"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scriptSchema = new Schema({

    // _id: ObjectId,
    author: Schema.Types.ObjectId,
    name: String,
    description: String,
    type: { type: String, lowercase: true },
    dependencies: [Schema.Types.ObjectId,],
    permissions: [{
        type: String,
        lowercase: true
    }],
    event: { type: String, lowercase: true },
    emit: { type: String, lowercase: true },
    code: String
});

module.exports = mongoose.model("Script", scriptSchema);
