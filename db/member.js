"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memberSchema = new Schema({

});

module.exports = mongoose.model("Member", memberSchema);
