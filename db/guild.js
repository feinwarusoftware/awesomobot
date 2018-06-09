"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guildSchema = new Schema({

});

module.exports = mongoose.model("Guild", guildSchema);
