"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

});

module.exports = mongoose.model("User", userSchema);
