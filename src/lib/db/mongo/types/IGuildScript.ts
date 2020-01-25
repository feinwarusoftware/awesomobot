import { Types, Document } from "mongoose";

import IGuildScriptPerms from "./IGuildScriptPerms";

interface IGuildScript extends Document {
  object_id: Types.ObjectId,
  permissions: IGuildScriptPerms
}

export default IGuildScript;
