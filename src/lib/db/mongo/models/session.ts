"use strict";

const mongoose = require("mongoose");

const { SessionSchema } = require("../schema");
// why? - so the imported objects' names actually make sense
const SessionModel = SessionSchema;

module.exports = mongoose.model("Guild", SessionModel);
