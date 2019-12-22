import { Schema } from "mongoose";

const SessionSchema = new Schema({

  //  _id: ObjectId,
  nonce: { type: String, default: null },
  complete: { type: Boolean, default: false },
  discord: {
    id: { type: String, default: null },
    access_token: { type: String, default: null },
    token_type: { type: String, default: null },
    expires_in: { type: String, default: null },
    refresh_token: { type: String, default: null },
    scope: { type: String, default: null }
  }
});

export default SessionSchema;
