import { IGuild, IGuildScript, IScript, IUser, ISocial, IModule, IColour } from "../../../lib/db/mongo/types";
import { Field, ID, InputType } from "type-graphql";
import { Types } from "mongoose";

// Note: yes i do realise that these shouldnt all be optional whe creating
// new instances in the database, I was short on time, will fix

@InputType()
class GuildInput implements Partial<IGuild> {
  @Field(() => String, { nullable: true })
  public prefix?: string;
}

// Note: I realise that some things should only be settable on creation and not
// on updates, I will fix that in the next api version
@InputType()
class ScriptInput implements Partial<IScript> {
  @Field(() => String, { nullable: true })
  public name?: string;

  @Field(() => String, { nullable: true })
  public description?: string;

  @Field(() => String, { nullable: true })
  public help?: string;

  @Field(() => String, { nullable: true })
  public thumbnail?: string;

  @Field(() => Boolean, { nullable: true })
  public marketplace_enabled?: boolean;

  @Field(() => String, { nullable: true })
  public type?: string;

  @Field(() => String, { nullable: true })
  public match_type?: string;

  @Field(() => String, { nullable: true })
  public match?: string;

  @Field(() => String, { nullable: true })
  public code?: string;

  @Field(() => String, { nullable: true })
  public created_with?: string;
}

@InputType()
class Social implements Partial<ISocial> {
  @Field(() => String, { nullable: true })
  public name?: string;

  @Field(() => String, { nullable: true })
  public icon?: string;

  @Field(() => String, { nullable: true })
  public url?: string;
}

@InputType()
class Module implements Partial<IModule> {
  @Field(() => String, { nullable: true })
  public name?: string;

  @Field(() => Boolean, { nullable: true })
  public enabled?: boolean;

  @Field(() => [String], { nullable: true })
  public content?: string[];
}

@InputType()
class Colour implements Partial<IColour> {
  @Field(() => String, { nullable: true })
  public progress?: string;

  @Field(() => String, { nullable: true })
  public level?: string;

  @Field(() => String, { nullable: true })
  public rank?: string;

  @Field(() => String, { nullable: true })
  public name?: string;
}

@InputType()
class UserInput implements Partial<IUser> {
  @Field(() => String, { nullable: true })
  public banner?: string;

  @Field(() => String, { nullable: true })
  public bio?: string;

  @Field(() => [Social], { nullable: true })
  public socials?: ISocial[];

  @Field(() => [Module], { nullable: true })
  public modules?: IModule[];

  @Field(() => Colour, { nullable: true })
  public colours?: IColour;
}

export {
  GuildInput,
  ScriptInput,
  UserInput,
};
