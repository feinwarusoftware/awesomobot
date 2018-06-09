"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    user: String,
    type: String,
    desc: String
});

module.exports = mongoose.model("Report", ReportSchema);
