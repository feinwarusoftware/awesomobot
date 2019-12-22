"use strict";

const mongoose = require("mongoose");

const { GuildSchema } = require("../schema");
// why? - so the imported objects' names actually make sense
const GuildModel = GuildSchema;

module.exports = mongoose.model("Guild", GuildModel);
