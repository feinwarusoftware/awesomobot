import { IGuild, IGuildScript, IScript, IUser, ISocial, IModule, IColour } from "../../../lib/db/mongo/types";
import { Field, ID, InputType, ArgsType, registerEnumType, Int } from "type-graphql";
import { Types } from "mongoose";

enum SortDirection {
  NONE = 0,
  ASCENDING = 1,
  DESCENDING = -1,
}

enum ScriptSortField {
  LIKES,
  GUILD_COUNT,
  USE_COUNT,
}

enum DiscordUserFields {
  NONE = 0x0,
  USERNAME = 0x1,
  AVATAR_URL = 0x2,
}

enum DiscordScriptUserFields {
  NONE = 0x0,
  USERNAME = 0x1,
  VERIFIED = 0x2,
}

enum UserSortField {
  XP,
  SHITS,
}

registerEnumType(SortDirection, {
  name: "SortDirection",
})

registerEnumType(ScriptSortField, {
  name: "ScriptSortField",
})

registerEnumType(UserSortField, {
  name: "UserSortField",
})

@ArgsType()
abstract class BaseArgs {
  @Field(() => Int, { nullable: true })
  public take?: number;

  @Field(() => Int, { nullable: true })
  public skip?: number;

  @Field(() => SortDirection, { nullable: true })
  public sort?: SortDirection;
}

@ArgsType()
class GuildArgs extends BaseArgs {
  @Field(() => [ID], { nullable: true })
  public ids?: Types.ObjectId[];

  @Field(() => [ID], { nullable: true })
  public discordIds?: Types.ObjectId[];

  @Field(() => Boolean, { nullable: true })
  public premium?: boolean;

  @Field(() => [ID], { nullable: true })
  public scripts?: Types.ObjectId[];
}

@ArgsType()
class ScriptArgs extends BaseArgs {
  @Field(() => [ID], { nullable: true })
  public ids?: Types.ObjectId[];

  @Field(() => [ID], { nullable: true })
  public authorIds?: Types.ObjectId[];

  @Field(() => String, { nullable: true })
  public name?: string;

  @Field(() => Boolean, { nullable: true })
  public local?: boolean;

  @Field(() => Boolean, { nullable: true })
  public featured?: boolean;

  @Field(() => Boolean, { nullable: true })
  public preload?: boolean;

  @Field(() => Boolean, { nullable: true })
  public verified?: boolean;

  @Field(() => ID, { nullable: true })
  public likedById?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  public likedByDiscordId?: string;

  @Field(() => Int, { nullable: true })
  public discordUserFields?: number;

  // Sort fields
  @Field(() => ScriptSortField, { nullable: true })
  public sortField?: ScriptSortField;
}

@ArgsType()
class UserArgs extends BaseArgs {
  @Field(() => [ID], { nullable: true })
  public ids?: Types.ObjectId[];

  @Field(() => [ID], { nullable: true })
  public discordIds?: Types.ObjectId[];

  @Field(() => Boolean, { nullable: true })
  public admin?: boolean;

  @Field(() => Boolean, { nullable: true })
  public verified?: boolean;

  @Field(() => Boolean, { nullable: true })
  public developer?: boolean;

  @Field(() => Boolean, { nullable: true })
  public premium?: boolean;

  @Field(() => Int, { nullable: true })
  public discordFields?: number;

  // Sort fields
  @Field(() => UserSortField, { nullable: true })
  public sortField?: UserSortField;
}

export {
  GuildArgs,
  ScriptArgs,
  UserArgs,
}
