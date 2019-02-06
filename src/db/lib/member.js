"use strict";

const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({

});

module.exports = mongoose.model("Member", MemberSchema);
