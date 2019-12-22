"use strict";

const mongoose = require("mongoose");

const permNodeSchema = new mongoose.Schema({

  whitelist: { type: Boolean, default: false },
  list: [ String ]
}, {
  _id: false
});

const scriptPermSchema = new mongoose.Schema({

  enabled: { type: String, default: false },
  members: permNodeSchema,
  channels: permNodeSchema,
  roles: permNodeSchema
}, {
  _id: false
});

const GuildScriptSchema = new mongoose.Schema({

  object_id: { type: Schema.Types.ObjectId, required: true },
  permissions: scriptPermSchema
}, {
  _id: false
});

module.exports = GuildScriptSchema;
