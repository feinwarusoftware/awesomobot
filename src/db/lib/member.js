"use strict";

const mongoose = require("mongoose");

const { ScriptDataSchema } = require("./utils");

const MemberSchema = new mongoose.Schema({

  // _id

  discord_id: {
    type: String,
    required: true
  },
  guild_id: {
    type: String,
    required: true
  },

  user_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  guild_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  },

  script_data: [ ScriptDataSchema ]
});

module.exports = mongoose.model("Member", MemberSchema);
