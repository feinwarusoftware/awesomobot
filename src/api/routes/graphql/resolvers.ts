import "reflect-metadata"
import { Guild, GuildCollection, Script, ScriptCollection, User, UserCollection } from "./types";
import { GuildInput, ScriptInput, UserInput } from "./inputs";
import { GuildArgs, ScriptArgs, UserArgs } from "./args";
import { Resolver, Query, Arg, Mutation, Args, ID } from "type-graphql";
import { Types } from "mongoose";
import { GuildService, ScriptService, UserService } from "../../../lib/db/mongo/services";

@Resolver(Guild)
class GuildResolver {
  // TODO: Add service type
  constructor(
    private readonly guildService: GuildService,
  ) {}

  @Query(() => Guild)
  async getGuildById(@Arg("id", () => ID) id: Types.ObjectId) {
    const guild = await this.guildService.getOneById(id);
    return guild;
  }

  @Query(() => Guild)
  async getGuildByDiscordId(@Arg("discordID", () => ID) discordId: string) {
    const guild = await this.guildService.getOneByDiscordId(discordId);
    return guild;
  }

  @Query(() => GuildCollection)
  async getGuilds(@Args() { take, skip, sort, ids, discordIds, premium, scripts }: GuildArgs) {
    const filters = {
      ...(ids == null ? {} : { _id: { $in: ids } }),
      ...(discordIds == null ? {} : { discord_id: { $in: discordIds } }),
      ...(premium == null ? {} : { premium }),
      ...(scripts == null ? {} : { "scripts.object_id": { $in: scripts } }),
    };
    
    const guilds = await this.guildService.getMany(take, skip, sort, undefined, filters);
    return guilds;
  }

  @Mutation(() => Guild)
  async createGuild(@Arg("guildData") guildData: GuildInput) {
    const guild = await this.guildService.createOne(guildData);
    return guild;
  }

  @Mutation(() => [Boolean])
  async updateGuild(@Arg("id", () => ID) id: Types.ObjectId, @Arg("guildData") guildData: GuildInput) {
    const guild = await this.guildService.updateOne(id, guildData);
    return guild;
  }

  @Mutation(() => [Boolean])
  async deleteGuild(@Arg("id", () => ID) id: Types.ObjectId) {
    const guild = await this.guildService.deleteOne(id);
    return guild;
  }

  // Adding scripts
  @Mutation(() => [Boolean])
  async addGuildScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {
    const guild = await this.guildService.addGuildScript(id, scriptId)
    return guild;
  }

  @Mutation(() => [Boolean])
  async removeGuildScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {
    const guild = await this.guildService.removeGuildScript(id, scriptId);
    return guild;
  }

  @Mutation(() => [Boolean])
  async addGuildScriptByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {
    const guild = await this.guildService.removeGuildScriptByDiscordId(discordId, scriptId);
    return guild;
  }

  @Mutation(() => [Boolean])
  async removeGuildScriptByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {
    const guild = await this.guildService.removeGuildScriptByDiscordId(discordId, scriptId);
    return guild;
  }
}

@Resolver(Script)
class ScriptResolver {
  // TODO: Add service type
  constructor(
    private readonly scriptService: ScriptService,
  ) {}

  @Query(() => Script)
  async getScriptById(@Arg("id", () => ID) id: Types.ObjectId, @Arg("discordUserFields") discordUserFields: number) {
    const script = await this.scriptService.getOneByIdWithDiscordUserFields(id, discordUserFields);
    return script;
  }

  @Query(() => ScriptCollection)
  async getScripts(@Args() { take, skip, sort, ids, authorIds, name, local, featured, preload, verified, discordUserFields, sortField }: ScriptArgs) {    
    const filters = {
      ...(ids == null ? {} : { _id: { $in: ids } }),
      ...(authorIds == null ? {} : { author_id: { $in: authorIds } }),
      ...(name == null ? {} : { name: { $regex: `.*${name}.*`, $options: "i" } }),
      ...(local == null ? {} : { local }),
      ...(featured == null ? {} : { featured }),
      ...(preload == null ? {} : { preload }),
      ...(verified == null ? {} : { verified }),
    };
    
    const scripts = await this.scriptService.getManyWithDiscordUserFields(take, skip, sort, sortField, filters, discordUserFields);
    return scripts;
  }

  @Mutation(() => Script)
  async createScript(@Arg("scriptData") scriptData: ScriptInput) {
    const script = await this.scriptService.createOne(scriptData);
    return script;
  }

  @Mutation(() => [Boolean])
  async updateScript(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptData") scriptData: ScriptInput) {
    const script = await this.scriptService.updateOne(id, scriptData);
    return script;
  }

  @Mutation(() => [Boolean])
  async deleteScript(@Arg("id", () => ID) id: Types.ObjectId) {
    const script = await this.scriptService.deleteOne(id);
    return script;
  }
}

@Resolver(User)
class UserResolver {
  // TODO: Add service type
  constructor(
    private readonly userService: UserService,
  ) {}

  @Query(() => User)
  async getUserById(@Arg("id", () => ID) id: Types.ObjectId, @Arg("discordFields") discordFields: number) {
    const user = await this.userService.getOneByIdWithDiscordFields(id, discordFields)
    return user;
  }

  @Query(() => User)
  async getUserByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("discordFields") discordFields: number) {
    const user = await this.userService.getOneByDiscordIdWithDiscordFields(discordId, discordFields);
    return user;
  }

  @Query(() => UserCollection)
  async getUsers(@Args() { take, skip, sort, ids, discordIds, admin, verified, developer, premium, discordFields, sortField }: UserArgs) {
    const filters = {
      ...(ids == null ? {} : { _id: { $in: ids } }),
      ...(discordIds == null ? {} : { discord_id: { $in: discordIds } }),
      ...(admin == null ? {} : { admin }),
      ...(verified == null ? {} : { verified }),
      ...(developer == null ? {} : { developer }),
      ...(premium == null ? {} : { premium }),
    };
    
    const user = await this.userService.getManyWithDiscordFields(take, skip, sort, sortField, filters, discordFields)
    return user;
  }

  @Mutation(() => User)
  async createUser(@Arg("userData") userData: UserInput) {
    const user = await this.userService.createOne(userData);
    return user;
  }

  @Mutation(() => [Boolean])
  async updateUser(@Arg("id", () => ID) id: Types.ObjectId, @Arg("userData") userData: UserInput) {
    const user = await this.userService.updateOne(id, userData);
    return user;
  }

  @Mutation(() => [Boolean])
  async deleteUser(@Arg("id", () => ID) id: Types.ObjectId) {
    const user = await this.userService.deleteOne(id);
    return user;
  }

  // Fetching liked scripts
  @Query(() => User)
  async getLikedScriptsByUserId(@Arg("id", () => ID) id: Types.ObjectId, @Arg("discordFields") discordFields: number) {

  }

  @Query(() => User)
  async getLikedScriptsByUserDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("discordFields") discordFields: number) {

  }

  // Liking scripts
  @Mutation(() => [Boolean])
  async addUserScriptLike(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {
    const like = await this.userService.addUserScriptLike(id, scriptId)
    return like;
  }

  @Mutation(() => [Boolean])
  async removeUserScriptLike(@Arg("id", () => ID) id: Types.ObjectId, @Arg("scriptId") scriptId: string) {
    const like = await this.userService.removeUserScriptLike(id, scriptId)
    return like;
  }

  @Mutation(() => [Boolean])
  async addUserScriptLikeByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {
    const like = await this.userService.addUserScriptLikeByDiscordId(discordId, scriptId)
    return like;
  }

  @Mutation(() => [Boolean])
  async removeUserScriptLikeByDiscordId(@Arg("discordId", () => ID) discordId: string, @Arg("scriptId") scriptId: string) {
    const like = await this.userService.removeUserScriptLikeByDiscordId(discordId, scriptId)
    return like;
  }
}

export {
  GuildResolver,
  ScriptResolver,
  UserResolver,
};
