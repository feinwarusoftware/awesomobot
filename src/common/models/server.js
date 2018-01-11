"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServerSchema = new Schema({
    _id: String,
    issues: Array,
    watchlist: Array,
    stats: Array,
    graphs: Array,
    members: Array
});

module.exports = mongoose.model("Server", ServerSchema);