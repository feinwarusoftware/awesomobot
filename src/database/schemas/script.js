"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guildSchema = new Schema({

    //  _id: ObjectId,
    
});

module.exports = mongoose.model("Guild", guildSchema);
