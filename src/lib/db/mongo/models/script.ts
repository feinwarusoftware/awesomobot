import { model } from "mongoose";

import { ScriptSchema } from "../schema";
import { IScript } from "../../types";

export default model<IScript>("Script", ScriptSchema);
