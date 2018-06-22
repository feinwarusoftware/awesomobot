"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScriptSchema = new Schema({

    //  _id: ObjectId,
    local: { type: Boolean, required: true },
    author: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "*(placeholder)*" },
    type: { type: String, required: true },
    permissions: { type: Number, required: true },
    code: { type: String, required: true }
});

module.exports = mongoose.model("Script", ScriptSchema);
