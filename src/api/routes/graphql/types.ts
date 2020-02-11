import { IGuild, IGuildScript, IScript, IUser, ISocial, IModule, IColour } from "../../../lib/db/mongo/types";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Types } from "mongoose";

@ObjectType()
class GuildScript implements Partial<IGuildScript> {
  @Field(() => ID)
  public object_id!: Types.ObjectId;
}

@ObjectType()
class Guild implements Partial<IGuild> {
  @Field(() => ID)
  public _id!: Types.ObjectId;

  @Field(() => String)
  public discord_id!: string;

  @Field(() => String)
  public prefix!: string;

  @Field(() => Boolean)
  public premium!: boolean;

  @Field(() => [GuildScript])
  public scripts!: IGuildScript[];
}

@ObjectType()
class GuildCollection {
  @Field(() => Int)
  public count!: number;

  @Field(() => [Guild])
  public data!: Guild[];
}

@ObjectType()
class Script implements Partial<IScript> {
  @Field(() => ID)
  public _id!: Types.ObjectId;

  @Field(() => String)
  public author_id!: string;

  @Field(() => String)
  public name!: string;

  @Field(() => String)
  public description!: string;

  @Field(() => String)
  public help!: string;

  @Field(() => String)
  public thumbnail!: string;

  @Field(() => Boolean)
  public marketplace_enabled!: boolean;

  @Field(() => String)
  public type!: string;

  @Field(() => String)
  public match_type!: string;

  @Field(() => String)
  public match!: string;

  @Field(() => String)
  public code!: string;

  @Field(() => Boolean)
  public local!: boolean;

  @Field(() => Boolean)
  public featured!: boolean;

  @Field(() => Boolean)
  public preload!: boolean;

  @Field(() => Boolean)
  public verified!: boolean;

  @Field(() => Int)
  public likes!: number;

  @Field(() => Int)
  public guild_count!: number;

  @Field(() => Int)
  public use_count!: number;

  @Field(() => String)
  public created_with!: string;

  @Field(() => Date)
  public created_at!: Date;

  @Field(() => Date)
  public updated_at!: Date;

  // Discord fields
  @Field(() => String)
  public authorUsername!: string;

  @Field(() => Boolean)
  public authorVerified!: boolean;
}

@ObjectType()
class ScriptCollection {
  @Field(() => Int)
  public count!: number;

  @Field(() => [Script])
  public data!: Script[];
}

@ObjectType()
class Social implements Partial<ISocial> {
  @Field(() => String)
  public name!: string;

  @Field(() => String)
  public icon!: string;

  @Field(() => String)
  public url!: string;
}

@ObjectType()
class Module implements Partial<IModule> {
  @Field(() => String)
  public name!: string;

  @Field(() => Boolean)
  public enabled!: boolean;

  @Field(() => [String])
  public content!: string[];
}

@ObjectType()
class Colour implements Partial<IColour> {
  @Field(() => String)
  public progress!: string;

  @Field(() => String)
  public level!: string;

  @Field(() => String)
  public rank!: string;

  @Field(() => String)
  public name!: string;
}

@ObjectType()
class User implements Partial<IUser> {
  @Field(() => ID)
  public _id!: Types.ObjectId;

  @Field(() => String)
  public discord_id!: string;

  @Field(() => String)
  public banner!: string;

  @Field(() => String)
  public bio!: string;

  @Field(() => [Social])
  public socials!: ISocial[];

  @Field(() => [Module])
  public modules!: IModule[];

  @Field(() => Colour)
  public colours!: IColour;

  @Field(() => Boolean)
  public admin!: boolean;

  @Field(() => Boolean)
  public verified!: boolean;

  @Field(() => Boolean)
  public developer!: boolean;

  @Field(() => String)
  public tier!: string;

  @Field(() => String)
  public premium!: string[];

  @Field(() => Int)
  public xp!: number;

  @Field(() => Int)
  public shits!: number;

  @Field(() => String)
  public trophies!: string[];

  @Field(() => [ID])
  public likes!: Types.ObjectId[];

  // Discord fields
  @Field(() => String)
  public username!: string;
  
  @Field(() => String)
  public avatarUrl!: string;
}

@ObjectType()
class UserCollection {
  @Field(() => Int)
  public count!: number;

  @Field(() => [User])
  public data!: User[];
}

export {
  Guild,
  GuildCollection,
  Script,
  ScriptCollection,
  User,
  UserCollection,
};
