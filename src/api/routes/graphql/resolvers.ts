import "reflect-metadata"
import { Guild, Script, User } from "./types";
import { GuildInput, ScriptInput, UserInput } from "./inputs";
import { GuildArgs, ScriptArgs, UserArgs } from "./args";
import { Resolver, Query, Arg, Mutation, Args, ID } from "type-graphql";
import { Types } from "mongoose";

@Resolver(Guild)
class GuildResolver {
  // TODO: Add service type
  constructor(
    private readonly guildService: any,
  ) {}

  @Query(() => Guild)
  async getGuildById(@Arg("id", () => ID) id: Types.ObjectId) {

  }

  @Query(() => Guild)
  async getGuildByDiscordId(@Arg("discordID", () => ID) discordId: string) {

  }

  @Query(() => [Guild])
  async getGuilds(@Args() { take, skip, sort, ids, discordIds, premium, scripts }: GuildArgs) {

  }

  @Mutation(() => [Guild])
  async createGuild(@Arg("guildData") guildData: GuildInput) {

  }

  @Mutation(() => [Boolean])
  async updateGuild(@Arg("id", () => ID) id: Types.ObjectId, @Arg("guildData") guildData: GuildInput) {

  }

  @Mutation(() => [Boolean])
  async deleteGuild(@Arg("id", () => ID) id: Types.ObjectId) {

  }

  // Adding scripts
  @Mutation(() => [Boolean])
  async addGuildScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async removeGuildScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async addGuildScriptByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async removeGuildScriptByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {

  }
}

@Resolver(Script)
class ScriptResolver {
  // TODO: Add service type
  constructor(
    private readonly scriptService: any,
  ) {}

  @Query(() => Guild)
  async getScriptById(@Arg("id", () => ID) id: Types.ObjectId) {

  }

  @Query(() => [Guild])
  async getScripts(@Args() { take, skip, sort, ids, authorIds, name, local, featured, preload, verified, likedById, likedByDiscordId, discordUserFields, sortField }: ScriptArgs) {

  }

  @Mutation(() => [Guild])
  async createScript(@Arg("scriptData") scriptData: ScriptInput) {

  }

  @Mutation(() => [Boolean])
  async updateScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptData") scriptData: ScriptInput) {

  }

  @Mutation(() => [Boolean])
  async deleteScript(@Arg("id", () => ID) id: Types.ObjectId) {

  }
}

@Resolver(User)
class UserResolver {
  // TODO: Add service type
  constructor(
    private readonly userService: any,
  ) {}

  @Query(() => Guild)
  async getUserById(@Arg("id", () => ID) id: Types.ObjectId) {

  }

  @Query(() => Guild)
  async getUserByDiscordId(@Arg("discordId", () => ID) discordId: string) {

  }

  @Query(() => [Guild])
  async getUsers(@Args() { take, skip, sort, ids, discordIds, admin, verified, developer, premium, discordFields, sortField }: UserArgs) {

  }

  @Mutation(() => [Guild])
  async createUser(@Arg("userData") userData: UserInput) {

  }

  @Mutation(() => [Boolean])
  async updateUser(@Arg("id", () => ID) id: Types.ObjectId, @Arg("userData") userData: UserInput) {

  }

  @Mutation(() => [Boolean])
  async deleteUser(@Arg("id", () => ID) id: Types.ObjectId) {

  }

  // Liking scripts
  @Mutation(() => [Boolean])
  async addUserScriptLike(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async removeUserScriptLike(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async addUserScriptLikeByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {

  }

  @Mutation(() => [Boolean])
  async removeUserScriptLikeByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {

  }
}

export {
  GuildResolver,
  ScriptResolver,
  UserResolver,
};
