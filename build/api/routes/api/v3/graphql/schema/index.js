"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = __importDefault(require("./guild"));
const guildScript_1 = __importDefault(require("./guildScript"));
const script_1 = __importDefault(require("./script"));
const user_1 = __importDefault(require("./user"));
// extending types is broke for some reason, so this is the next best way...
const schema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    me: User

    scripts: [Script]
    script(scriptId: ID!): Script

    guilds: [Guild]
    guild(guildId: ID!): Guild

    guildScripts: [GuildScript]
    guildScript(guildId: ID!, scriptId: ID!): GuildScript
  }

  type Mutation {
    addUser(userData: UserInput): User
    updateUser(userId: ID!, userData: UserInput): UpdateInfo
    deleteUser(userId: ID!, userData: UserInput): DeleteInfo

    addScript(scriptData: ScriptInput): Script
    updateScript(scriptId: ID!, scriptData: ScriptInput): UpdateInfo
    deleteScript(scriptId: ID!, scriptData: ScriptInput): DeleteInfo

    addGuild(guildData: GuildInput): Guild
    updateGuild(guildId: ID!, guildData: GuildInput): UpdateInfo
    deleteGuild(guildId: ID!, guildData: GuildInput): DeleteInfo

    addGuildScript(guildId: ID!, guildScriptData: GuildScriptInput): GuildScript
    updateGuildScript(guildId: ID!, scriptId: ID!, guildScriptData: GuildScriptInput): UpdateInfo
    deleteGuildScript(guildId: ID!, scriptId: ID!, guildScriptData: GuildScriptInput): DeleteInfo
  }

  type UpdateInfo {
    matched: Int
    modified: Int
  }

  type DeleteInfo {
    matched: Int
    deleted: Int
  }
`;
exports.default = [
    schema,
    guild_1.default,
    guildScript_1.default,
    script_1.default,
    user_1.default,
].join("");
//# sourceMappingURL=index.js.map