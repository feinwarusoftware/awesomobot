"use strict";

const mongoose = require("mongoose");

const { ScriptSchema } = require("../schema");
// why? - so the imported objects' names actually make sense
const ScriptModel = ScriptSchema;

module.exports = mongoose.model("Guild", ScriptModel);
