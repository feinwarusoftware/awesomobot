"use strict";

const mongoose = require("mongoose");

const { ScriptDataSchema } = require("./utils");

const defaultPrefix = "-";

const PremiumReferenceSchema = new mongoose.Schema({

  user_id: {
    type: String,
    required: true
  },
  user_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {

  _id: false
});

const ScriptOverrideSchema = new mongoose.Schema({

  match_type : {
    type: String,
    requird: true
  },
  match: {
    type: String,
    required: true
  }
}, {

  _id: false
});

const PermissionListSchema = new mongoose.Schema({

  whitelist: {
    type: Boolean,
    default: false
  },
  list: [ String ]
}, {

  _id: false
});

const ScriptPermissionsSchema = new mongoose.Schema({

  enabled: {
    type: Boolean,
    default: true
  },
  members: {
    type: PermissionListSchema,
    default: null
  },
  channels: {
    type: PermissionListSchema,
    default: null
  },
  roles: {
    type: PermissionListSchema,
    default: null
  }
}, {

  _id: false
});

const GuildScriptSchema = new mongoose.Schema({

  script_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  },

  overrides: {
    type: ScriptOverrideSchema,
    default: null
  },
  permissions: {
    type: ScriptPermissionsSchema,
    default: null
  }
}, {

  _id: false
});

const MemberReferenceSchema = new mongoose.Schema({

  member_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user_mid: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {

  _id: false
});

const GuildSchema = new mongoose.Schema({

  // _id

  discord_id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: defaultPrefix
  },
  premium_ref: {
    type: PremiumReferenceSchema,
    default: null
  },

  scripts: [ GuildScriptSchema ],

  member_refs: [ MemberReferenceSchema ],

  script_data: [ ScriptDataSchema ]
});

module.exports = mongoose.model("Guild", GuildSchema);
