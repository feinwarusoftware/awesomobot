import { Types, Document } from "mongoose";

interface ISocial {
  name: string,
  icon: string,
  url: string
}

interface IModule {
  name: string,
  enabled: boolean,
  content: string[]
}

interface IColour {
  progress: string,
  level: string,
  rank: string,
  name: string
}

interface IUser extends Document {
  _id: Types.ObjectId,

  discord_id: string,

  banner: string,
  bio: string,
  socials: ISocial[],
  modules: IModule[],
  colours: IColour,

  admin: boolean,
  verified: boolean,
  developer: boolean,
  tier: string,
  premium: string[],

  xp: number,
  shits: number,
  trophies: string[],

  likes: Types.ObjectId[]
}

export default IUser;
