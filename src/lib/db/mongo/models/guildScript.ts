"use strict";

const mongoose = require("mongoose");

const { GuildScriptSchema } = require("../schema");
// why? - so the imported objects' names actually make sense
const GuildScriptModel = GuildScriptSchema;

module.exports = mongoose.model("Guild", GuildScriptModel);
