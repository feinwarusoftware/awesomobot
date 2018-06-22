
"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    //  _id: ObjectId,
    discord_id: { type: String, required: true, unique: true },
    scripts: [ Schema.Types.ObjectId ]
});

module.exports = mongoose.model("User", UserSchema);
