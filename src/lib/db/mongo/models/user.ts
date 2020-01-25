import { model } from "mongoose";

import { UserSchema } from "../schema";
import { IUser } from "../types";

export default model<IUser>("User", UserSchema);
