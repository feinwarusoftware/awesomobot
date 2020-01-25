import { model } from "mongoose";

import { GuildSchema } from "../schema";
import { IGuild } from "../types";

export default model<IGuild>("Guild", GuildSchema);
