"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServerSchema = new Schema({
    _id: String,
    issues: Array
});

module.exports = mongoose.model("Server", ServerSchema);