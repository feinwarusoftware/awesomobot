import { Types, Document } from "mongoose";

interface ISession extends Document {
  _id: Types.ObjectId,

  nonce: string,
  complete: boolean,
  discord: {
    id: string,
    access_token: string,
    token_type: string,
    expires_in: string,
    refresh_token: string,
    scope: string
  }
}

interface ISessionFilters {
  _id?: Types.ObjectId,

  discord?: {
    id?: string,
    expiresIn?: string,
  }
}

export {
  ISession,
  ISessionFilters,
};
