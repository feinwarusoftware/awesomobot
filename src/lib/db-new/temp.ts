import { prop, getModelForClass, setGlobalOptions, ReturnModelType } from "@typegoose/typegoose";
import mongoose from "mongoose";
import muuid from "uuid-mongodb";
import { Binary } from "bson";
import { Client, User as DiscordUser } from "discord.js";
import { ObjectType, buildSchema, Field, Resolver, Query, Arg, ClassType, Int, ID } from "type-graphql";
import { Service, Inject, Container } from "typedi";

// the helper function
// function applyMixins(derivedCtor: any, baseCtors: any[]) {
//   baseCtors.forEach(baseCtor => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//       Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
//     });
//   });
// }

// types

// needs 'create a new thing' function -> ties everything up, adds the route, etc.

// need generic overarching types

// IType - overarching type
// Type implements IType - database type, also includes gql shit (cos why not)
// IExtendedType extends IType - extra info not from out api
// TypeService returns IType (virtuals cause issues if Type is returned), also returns IExtendedType (+ discord data)
// ITypeArgs - filters for database search
// ITypeInput - props for creating/altering db entries
// TypeResolver - gql routes thing (idk if this needs to extend anything lel)

interface IDataType {
  _id: object,
  __v?: number,

  id: string,
}

// dont even need this to be generic lel, abstract?
@ObjectType()
class DataType implements IDataType {
  @prop({
    required: true,
    default: muuid.v4,
  })
  public _id!: object;

  @prop()
  public __v?: number;

  // virtuals
  @Field()
  public get id(): string {
    return muuid.from(this._id as Binary).toString();
  }
}

const createDataTypeService = <T extends IDataType>(objectTypeCls: ClassType<T>) => {
  class DataTypeService {
    public findOne(uuid: string): Promise<T> {
      return new Promise(async (resolve, reject) => {
        try {
          const bsonUuid = muuid.from(uuid);
          const DataTypeModel = getModelForClass(objectTypeCls);

          const user: T = (await DataTypeModel.findById(bsonUuid))?.toObject();
          if (user == null) {
            return reject("User not found");
          }

          resolve(user);

        } catch (error) {
          reject(`Error executing findOneByUuid ${error}`);
        }
      });
    }

    public findMany(): Promise<T[]> {
      return new Promise((resolve, reject) => {
        try {
          // const DataTypeModel = getModelForClass();
  
          resolve();
  
        } catch (error) {
          reject(`Error executing findMultiple ${error}`);
        }
      });
    }
  }

  return DataTypeService;
}

// TODO: fix
// @Service()
// class DataTypeService<T extends IDataType> {
//   public findOne(uuid: string): Promise<T> {
//     return new Promise((resolve, reject) => {
//       try {
//         // const DataTypeModel = getModelForClass();

//         resolve();

//       } catch (error) {
//         reject(`Error executing findOneByUuid ${error}`);
//       }
//     });
//   }

//   public findMany(): Promise<T[]> {
//     return new Promise((resolve, reject) => {
//       try {
//         // const DataTypeModel = getModelForClass();

//         resolve();

//       } catch (error) {
//         reject(`Error executing findMultiple ${error}`);
//       }
//     });
//   }

//   // public createOne(): Promise<IDataType> {
//   //   return new Promise((resolve, reject) => {
//   //     try {

//   //     } catch (error) {
//   //       reject(`Error executing createOne ${error}`);
//   //     }
//   //   });
//   // }

//   // public updateOne(): Promise<void> {
//   //   return new Promise((resolve, reject) => {
//   //     try {

//   //     } catch (error) {
//   //       reject(`Error executing updateOne ${error}`);
//   //     }
//   //   });
//   // }

//   // public deleteOne(): Promise<void> {
//   //   return new Promise((resolve, reject) => {
//   //     try {

//   //     } catch (error) {
//   //       reject(`Error executing deleteOne ${error}`);
//   //     }
//   //   });
//   // }
// }

// EXAMPLE
// interface IExtendedDataType extends IDataType {}

// class TestService extends DataTypeService {
//   public findOneByDiscordId(discordId: string): IExtendedDataType {

//   }
// }
//

interface IDataTypeArgs {

}

interface IDataTypeInput {

}

// @Resolver(DataType)
// class DataTypeResolver<T extends IDataType> {
//   private readonly _dataTypeService: IDataTypeService;

//   // TODO: do the services properly + dependency injection
//   constructor(private dataTypeService: IDataTypeService) {
//     this._dataTypeService = dataTypeService;
//   }

//   @Query(returns => )
//   async test(@Arg("uuid") uuid: string) {
    
//   } 
// }

// const createBaseResolver = <T extends ClassType>(suffix: string, objectTypeCls: T) => {
//   @Resolver({
//     isAbstract: true,
//   })
//   abstract class BaseResolver {
//     protected items: T[] = [];

//     @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
//     async getAll(@Arg("first", type => Int) first: number): Promise<T[]> {
//       return this.items.slice(0, first);
//     }
//   }

//   return BaseResolver;
// }

// const UserBaseResolver = createBaseResolver("person", User);

// @Resolver(of => User)
// class UserResolver extends UserBaseResolver {

// }

const createDataTypeResolver = <T extends IDataType>(suffix: string, objectTypeCls: ClassType<T>) => {
  class DataTypeService extends createDataTypeService(objectTypeCls) {}

  @Resolver({
    isAbstract: true,
  })
  abstract class DataTypeResolver {
    constructor(
      private readonly _dataTypeService: DataTypeService,
    ) {}

    @Query(() => objectTypeCls, { name: `getOne${suffix}` })
    async getOne(@Arg("uuid", () => String) uuid: string): Promise<T> {
      return await this._dataTypeService.findOne(uuid);
    }

    @Query(() => objectTypeCls, { name: `getMany${suffix}s` })
    async getMany(): Promise<T[]> {
      return await this._dataTypeService.findMany();
    }
  }

  return DataTypeResolver;
}

@ObjectType()
class User extends DataType {
  @prop()
  @Field()
  public test?: string;
}

const UserBaseService = createDataTypeService(User);

@Service()
class UserService extends UserBaseService {
  public findOneByTest(test: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const UserModel = getModelForClass(User);

        const user: User = (await UserModel.findOne({ test }))?.toObject();
        if (user == null) {
          return reject(`No user found with test: ${test}`);
        }

        resolve(user);

      } catch (error) {
        reject(`Error finding user by test: ${error}`);
      }
    });
  }
}

const UserBaseResolver = createDataTypeResolver("User", User);

@Resolver(() => User)
class UserResolver extends UserBaseResolver {
  constructor(
    private readonly _userService: UserService,
  ) {
    super(_userService);
  }

  @Query(() => User)
  async getUserByTest(@Arg("test", () => String) test: string): Promise<User> {
    return await this._userService.findOneByTest(test);
  }
}

// @ObjectType()
// class Recipe {
//   @Field(type => ID)
//   id!: string;

//   @Field()
//   title!: string;

//   @Field({ nullable: true })
//   description?: string;

//   @Field()
//   creationDate!: Date;

//   @Field(type => [String])
//   ingredients!: string[];
// }

// @Resolver(Recipe)
// class RecipeResolver {
//   @Query(returns => Recipe)
//   async recipe(@Arg("id") id: string) {
//     return null;
//   }
// }

import fastify from "fastify";
import { ApolloServer, gql } from "apollo-server-fastify";

(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "awnext-test",
  });

  const schema = await buildSchema({
    resolvers: [UserResolver],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
  });

  const app = fastify();

  app.register(server.createHandler());
  await app.listen(80);
})();
