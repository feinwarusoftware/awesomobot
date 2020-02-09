import { prop, getModelForClass, setGlobalOptions, ReturnModelType } from "@typegoose/typegoose";
import mongoose from "mongoose";
import muuid from "uuid-mongodb";
import { Binary } from "bson";
import { Client, User as DiscordUser } from "discord.js";
import { buildSchema, ObjectType, Field, Resolver, Query, Arg, ClassType, Int } from "type-graphql";

const kDiscordBotToken = process.env.DISCORD_BOT_TOKEN;

const discordClient = new Client({
  fetchAllMembers: true,
});

// return the client instance afterwards so all the other
// functions dont have to access the global variable
const clientPromise = discordClient
  .login(kDiscordBotToken)
  .then(() => discordClient);

const fetchDiscordUser = (discordId: string, cache = true): Promise<DiscordUser> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await clientPromise;

      const discordUser = await client.fetchUser(discordId, cache);
      resolve(discordUser);

    } catch (error) {
      reject(`Could not fetch discord user: ${error}`)
    }
  });
};

setGlobalOptions({
  schemaOptions: {
    toObject: {
      virtuals: true,
    }
  }
});

enum UserFlags {
  NONE = 0,
  FEINWARU = 0x1,
  PARTNER = 0x2,
  DEVELOPER = 0x4,
  VERIFIED = 0x8,
}

enum SubscriptionType {
  FREE,
  SUPPORTER,
  PREMIUM,
}

interface IStats {
  xp?: number,
  shits?: number,
  trophies?: object[],
}

interface IProfile {
  banner?: string,
  bio?: string,
}

interface IUser {
  _id: object,
  __v?: number,
  discordId: string,
  flags?: UserFlags,
  subscription?: SubscriptionType,
  stats?: IStats,
  profile?: IProfile,
  id: string,
}

class Stats implements IStats {
  @prop({
    default: 0,
  })
  public xp?: number;

  @prop({
    default: 0,
  })
  public shits?: number;

  @prop()
  public trophies?: object[];
}

class Profile implements IProfile {
  @prop()
  public banner?: string;

  @prop()
  public bio?: string;
}

// Note: _id is the bson uuid, id is the string representation of the bson uuid,
// when searching mongo, use the _id field, when displaying the id to a user use the id field

// Note: anything with select set to false will still show up on database record
// creation, but will not show up in find requests, etc.
class User implements IUser {
  @prop({
    required: true,
    default: muuid.v4,
  })
  public _id!: object;

  @prop()
  public __v?: number;

  @prop({
    required: true,
    unique: true,
  })
  public discordId!: string;

  @prop({
    enum: UserFlags,
    default: UserFlags.NONE,
  })
  public flags?: UserFlags;

  @prop({
    enum: SubscriptionType,
    default: SubscriptionType.FREE,
  })
  public subscription?: SubscriptionType;

  @prop({
    _id: false,
    default: {},
  })
  public stats?: Stats;

  @prop({
    _id: false,
    default: {},
  })
  public profile?: Profile;

  // virtuals
  public get id(): string {
    return muuid.from(this._id as Binary).toString();
  }
}

const UserModel = getModelForClass(User);

// Note: the difference between save and create: create creates an initial entry in the
// database (will error if there already is one), while save overwrites an existing one

interface IUpdateInfo {
  matched: number,
  modified: number,
}

interface IDeleteInfo {
  matched: number,
  deleted: number,
}

interface UserResponse extends IUser {
  username?: string,
  avatarUrl?: string,
}

// Note: if you copy a DocumentType<any>, mongo will fuck with it, you can get the stuff
// that youd expect from DocumentType<any>.toObject, but that returns any for some reason...

// Note: on error handling - if mongo doesnt find something, it returns null, if discord
// doesnt find a user, it throws an error, im letting all errors happen and letting the
// try/catch handle them reporting them to the user
class UserService {
  public static getUserByUuid(uuid: string): Promise<UserResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const bsonUuid = muuid.from(uuid);

        const user: IUser = (await UserModel.findById(bsonUuid))?.toObject();
        if (user == null) {
          return reject("User not found");
        }

        const discordUser = await fetchDiscordUser(user.discordId);

        resolve({
          ...user,
          username: discordUser.username,
          avatarUrl: discordUser.avatarURL,
        });

      } catch (error) {
        reject(`Could not fetch user by uuid: ${error}`);
      }
    });
  }

  public static getUserByDiscordId(discordId: string): Promise<UserResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const [user, discordUser]: [IUser, DiscordUser] = await Promise.all([UserModel.findOne({ discordId }).then(userDocument => userDocument?.toObject()), fetchDiscordUser(discordId)]);
        if (user == null) {
          return reject("User not found");
        }

        resolve({
          ...user,
          username: discordUser.username,
          avatarUrl: discordUser.avatarURL,
        });

      } catch (error) {
        reject(`Could not fetch user by uuid: ${error}`);
      }
    });
  }

  public static getUsers(): Promise<UserResponse[]> {
    return new Promise(async (resolve, reject) => {
      try {

        // Note: none of the userDocuments should be null here, if there are none, the map wont run
        const users: IUser[] = (await UserModel.find({})).map(userDocument => userDocument.toObject());

        const discordUsers = await Promise.all(users.map(user => fetchDiscordUser(user.discordId)));

        resolve(users.map((user, i) => ({
          ...user,
          username: discordUsers[i].username,
          avatarUrl: discordUsers[i].avatarURL,
        })));

      } catch (error) {
        reject(`Could not fetch user by uuid: ${error}`);
      }
    });
  }

  // public static createUser(): Promise<User> {

  // }

  // public static saveUser() {

  // }

  // public static updateUser() {

  // }

  // public static deleteUser() {

  // }
}

(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "awnext-test",
  });

  const user = await UserModel.create({ discordId: "190914446774763520" } as User);
  //console.log(typeof ayy.id, muuid.from(ayy.id));
  const uuid = muuid.from(user.id);
  //console.log("ASFADF", uuid);

  const lmao = await UserModel.findById(uuid).exec();

  console.log(user);
  console.log(lmao);
  console.log(lmao?.id);

  const test = await UserService.getUserByUuid(lmao?.id);
  console.log(test);
})();

// @ObjectType()
// class UserSchema implements IUser {
//   public _id!: object;
//   public __v?: number;
//   public discordId!: string;
//   public flags?: UserFlags;
//   public subscription?: SubscriptionType;
//   public stats?: Stats;
//   public profile?: Profile;
//   public id!: string;
// }
