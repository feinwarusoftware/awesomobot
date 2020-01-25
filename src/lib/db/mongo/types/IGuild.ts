import { Types, Document } from "mongoose";

import IGuildScriptPerms from "./IGuildScriptPerms";
import IGuildScript from "./IGuildScript";

interface IMemberPerm {
  member_id: string,
  list: string[]
}

interface IGuild extends Document {
  _id: Types.ObjectId,

  discord_id: string,
  prefix: string,
  premium: boolean,
  member_perms: IMemberPerm[],
  script_perms: IGuildScriptPerms,
  scripts: IGuildScript[]
}

export default IGuild;
