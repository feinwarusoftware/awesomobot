"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
  type User {
    _id: ID,

    discord_id: String,

    banner: String,
    bio: String,
    socials: [ISocial],
    modules: [IModule],
    colours: IColour,

    admin: Boolean,
    verified: Boolean,
    developer: Boolean,
    tier: String,
    premium: [String],

    xp: Int,
    shits: Int,
    trophies: [String],

    likes: [ID]
  }

  input UserInput {
    discord_id: String,

    banner: String,
    bio: String,
    socials: [ISocialInput],
    modules: [IModuleInput],
    colours: IColourInput,

    admin: Boolean,
    verified: Boolean,
    developer: Boolean,
    tier: String,
    premium: [String],

    xp: Int,
    shits: Int,
    trophies: [String],

    likes: [ID]
  }

  type ISocial {
    name: String,
    icon: String,
    url: String
  }

  input ISocialInput {
    name: String,
    icon: String,
    url: String
  }

  type IModule {
    name: String,
    enabled: Boolean,
    content: [String]
  }

  input IModuleInput {
    name: String,
    enabled: Boolean,
    content: [String]
  }

  type IColour {
    progress: String,
    level: String,
    rank: String,
    name: String
  }

  input IColourInput {
    progress: String,
    level: String,
    rank: String,
    name: String
  }
`;
//# sourceMappingURL=user.js.map