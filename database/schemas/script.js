"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scriptSchema = new Schema({

    //  _id: ObjectId,
    author: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "rawrxd" },
    type: { type: String, required: true },
    permissions: { type: Number, required: true },
    dependencies: [ Schema.Types.ObjectId ],
    code: { type: String, required: true }
});

module.exports = mongoose.model("Script", scriptSchema);
