"use strict";

const mongoose = require("mongoose");

const { ScriptDataSchema } = require("./utils");

const OAuth2Schema = new mongoose.Schema({

  access_token: {
    type: String,
    required: true
  },
  token_type: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    required: true
  },

  expires_at: {
    type: Date,
    required: true
  }
}, {

  _id: false
});

// Reference to this user's member documents.
const MemberReferenceSchema = new mongoose.Schema({

  member_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  guild_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {

  _id: false
});

// User profile info.
const ProfileSchema = new mongoose.Schema({

  // NOTE: Add account links here!
}, {

  _id: false
});

const defaultProfile = new ProfileSchema({

  //
});

const PaypalPremiumSchema = new mongoose.Schema({

  tier: {
    type: String,
    enum: ["f", "bf", "sbf", "fortnite"],
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {

  _id: false
});

// Patron subscription info.
const PremiumSchema = new mongoose.Schema({

  payment_type: {
    type: String,
    enum: ["patreon", "paypal"],
    required: true
  },
  payment_info: {
    type: [PaypalPremiumSchema, OAuth2Schema],
    required: true
  }
}, {

  _id: false
});

// Main user schema.
const UserSchema = new mongoose.Schema({

  // _id

  discord_id: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },

  member_refs: [ MemberReferenceSchema ],

  profile: {
    type: ProfileSchema,
    default: defaultProfile
  },
  premium: {
    type: PremiumSchema,
    default: null
  },
  session: {
    type: OAuth2Schema,
    default: null
  },

  script_data: [ ScriptDataSchema ]
});

module.exports = mongoose.model("User", UserSchema);

// Note: Remove 'session' and 'premium' and
// have them as generic linked accounts!
