"use strict";

const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({

  //  _id: ObjectId,
  nonce: { type: String, default: null },
  complete: { type: Boolean, default: false },
  discord: {
    id: { type: String, default: null },
    access_token: { type: String, default: null },
    token_type: { type: String, default: null },
    expires_in: { type: String, default: null },
    refresh_token: { type: String, default: null },
    scope: { type: String, default: null }
  }
});

module.exports = SessionSchema;
