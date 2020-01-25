import { Types } from "mongoose";

interface ISocialInput {
  name?: string,
  icon?: string,
  url?: string
}

interface IModuleInput {
  name?: string,
  enabled?: boolean,
  content?: string[]
}

interface IColourInput {
  progress?: string,
  level?: string,
  rank?: string,
  name?: string
}

interface IUserInput {
  discord_id?: string,

  banner?: string,
  bio?: string,
  socials?: ISocialInput[],
  modules?: IModuleInput[],
  colours?: IColourInput,

  admin?: boolean,
  verified?: boolean,
  developer?: boolean,
  tier?: string,
  premium?: string[],

  xp?: number,
  shits?: number,
  trophies?: string[],

  // Change the ObjectId types to strings as they can be converted
  // and thats how theyre gonna be passed through the api anyway
  // Original: likes?: Types.ObjectId[]
  likes?: string[],
}

export default IUserInput;
