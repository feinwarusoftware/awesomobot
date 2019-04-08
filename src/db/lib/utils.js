"use strict";

const mongoose = require("mongoose");

const dataByteLimit = 16384;

const bytes = s => {
  return ~-encodeURI(s).split(/%..|./).length;
};

const jsonSize = s => {
  return bytes(JSON.stringify(s));
};

const ScriptDataSchema = new mongoose.Schema({

  script_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },

  data: {
    type: Map,
    validate: {
      validator: v => jsonSize(v) < dataByteLimit,
      message: props => `Data size: ${jsonSize(props.value)} bytes, exceeded allowed size of: ${dataByteLimit} bytes.`
    }
  }
}, {

  _id: false
});

module.exports = {

  ScriptDataSchema
};
