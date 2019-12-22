import { Schema } from "mongoose";

const permNodeSchema = new Schema({

  whitelist: { type: Boolean, default: false },
  list: [String]
}, {
  _id: false
});

const ScriptPermSchema = new Schema({

  enabled: { type: String, default: false },
  members: permNodeSchema,
  channels: permNodeSchema,
  roles: permNodeSchema
}, {
  _id: false
});

export default ScriptPermSchema;
