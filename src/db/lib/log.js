"use strict";

const mongoose = require("mongoose");

const logTypes = ["stdout", "warning", "error", "debug"];
const logClientTypes = ["bot", "web"];
const logContentTypes = ["string", "json"];

const LogContentSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: logContentTypes,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {

  _id: false
});

const LogSchema = new mongoose.Schema({

  // _id

  client: {
    type: String,
    enum: logClientTypes,
    required: true
  },
  type: {
    type: String,
    enum: logTypes,
    required: true
  },
  content: {
    type: LogContentSchema,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", LogSchema);
