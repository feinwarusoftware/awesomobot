import { Types, Document } from "mongoose";

interface IArgs {
  field: string,
  value: string
}

interface IData {
  action: string,
  args: IArgs[]
}

interface IScript extends Document {
  _id: Types.ObjectId,

  author_id: string,

  name: string,
  description: string,
  help: string,
  thumbnail: string
  marketplace_enabled: boolean,

  type: string,
  match_type: string,
  match: string,

  code: string,
  data: IData,

  local: boolean,
  featured: boolean,
  preload: boolean,
  verified: boolean,
  likes: number,
  guild_count: number,
  use_count: number,

  created_with: string,
  created_at: Date,
  updated_at: Date
}

export default IScript;
