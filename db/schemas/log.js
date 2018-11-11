"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogSchema = new Schema({

    //  _id: ObjectId,
    type: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", LogSchema);
