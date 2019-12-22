import { Schema } from "mongoose";

import * as GuildScriptPermsSchema from "./guildScriptPerms";

const GuildScriptSchema = new Schema({

  object_id: { type: Schema.Types.ObjectId, required: true },
  permissions: GuildScriptPermsSchema
}, {
  _id: false
});

export default GuildScriptSchema;
