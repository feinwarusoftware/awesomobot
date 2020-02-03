import guildSchema from "./guild";
import guildScriptSchema from "./guildScript";
import scriptSchema from "./script";
import userSchema from "./user";

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

    scripts(author_id: String, name: String, featured: Boolean, marketplace_enabled: Boolean, verified: Boolean, page: Int, limit: Int, sortField: String, sortDirection: Int): Scripts
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

export default [
  schema,
  guildSchema,
  guildScriptSchema,
  scriptSchema,
  userSchema,
].join("");
