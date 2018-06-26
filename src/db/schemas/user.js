"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    //  _id: ObjectId,
    discord_id: { type: String, required: true, unique: true, maxlength: 18, minlength: 18 },
    admin: { type: Boolean, default: false },
    scripts: [ Schema.Types.ObjectId ]
});

module.exports = mongoose.model("User", UserSchema);
