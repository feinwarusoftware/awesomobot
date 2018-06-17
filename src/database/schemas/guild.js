"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guildSchema = new Schema({

    //  _id: ObjectId,
    discordId: { type: String, required: true, unique: true },
    scripts: [ Schema.Types.ObjectId ],

    scriptData: [{
        index: false
    }]
});

module.exports = mongoose.model("Guild", guildSchema);
