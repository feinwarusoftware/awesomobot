import { IGuild, IGuildScript, IScript, IUser, ISocial, IModule, IColour } from "../../../lib/db/mongo/types";
import { Field, ID, InputType, ArgsType, registerEnumType, Int } from "type-graphql";
import { Types } from "mongoose";

enum SortDirection {
  NONE = 0,
  ASCENDING = 1,
  DESCENDING = -1,
}

enum ScriptSortField {
  LIKES = "likes",
  GUILD_COUNT = "guild_count",
  USE_COUNT = "use_count",
}

enum UserSortField {
  XP = "xd",
  SHITS = "shits",
}

registerEnumType(SortDirection, {
  name: "SortDirection",
});

registerEnumType(ScriptSortField, {
  name: "ScriptSortField",
});

registerEnumType(UserSortField, {
  name: "UserSortField",
});

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
  SortDirection,
}
