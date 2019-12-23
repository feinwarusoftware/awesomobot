import { model } from "mongoose";

import { GuildScriptSchema } from "../schema";
import { IGuildScript } from "../../types";

export default model<IGuildScript>("GuildScript", GuildScriptSchema);
