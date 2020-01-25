import { model } from "mongoose";

import { SessionSchema } from "../schema";
import { ISession } from "../types";

export default model<ISession>("Session", SessionSchema);
