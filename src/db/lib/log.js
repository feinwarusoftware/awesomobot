"use strict";

const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  // _id: ObjectId,
  client: {
    type: String,
    required: true,
    enum: ["bot", "web"]
  },
  type: {
    type: String,
    required: true,
    enum: ["stdout", "warning", "error", "debug"]
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

const LogContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["string", "json"]
  },
  message: {
    type: String,
    required: true
  }
}, {
  _id: false
});

module.exports = mongoose.model("Log", LogSchema);
