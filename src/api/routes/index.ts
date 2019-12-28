import { FastifyInstance } from "fastify";
import gql from "fastify-gql";

import apiV3 from "./v3";
import { userService } from "../../lib/db";

// temp
const schema = `
  type Query {
    users: [User]
    user(userId: ID!): User
  }

  type Mutation {
    addUser(userData: UserInput): User
    updateUser(userId: ID!, userData: UserInput!): User
    deleteUser(userId: ID!, userData: UserInput!): User
  }

  type User {
    _id: ID,

    discord_id: String,

    banner: String,
    bio: String,
    socials: [ISocial],
    modules: [IModule],
    colours: IColour,

    admin: Boolean,
    verified: Boolean,
    developer: Boolean,
    tier: String,
    premium: [String],

    xp: Int,
    shits: Int,
    trophies: [String],

    likes: [ID]
  }

  input UserInput {
    discord_id: String,

    banner: String,
    bio: String,
    socials: [ISocialInput],
    modules: [IModuleInput],
    colours: IColourInput,

    admin: Boolean,
    verified: Boolean,
    developer: Boolean,
    tier: String,
    premium: [String],

    xp: Int,
    shits: Int,
    trophies: [String],

    likes: [ID]
  }

  type ISocial {
    name: String,
    icon: String,
    url: String
  }

  input ISocialInput {
    name: String,
    icon: String,
    url: String
  }

  type IModule {
    name: String,
    enabled: Boolean,
    content: [String]
  }

  input IModuleInput {
    name: String,
    enabled: Boolean,
    content: [String]
  }

  type IColour {
    progress: String,
    level: String,
    rank: String,
    name: String
  }

  input IColourInput {
    progress: String,
    level: String,
    rank: String,
    name: String
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const users = await userService.getMany();

      return users;
    },
    user: async (_: any, { userId }: any) => {
      const user = await userService.getOneById(userId);

      return user;
    }
  },
  Mutation: {
    addUser: async (_: any, variables: any, context: any) => {
      const userData = context.reply.request.body.variables.userData ?? variables.userData;
      const user = await userService.saveOne(userData);

      return user;
    },
    updateUser: async (_: any, variables: any, context: any) => {
      const userId = context.reply.request.body.variables.userId ?? variables.userId;
      const userData = context.reply.request.body.variables.userData ?? variables.userData;
      const user = await userService.updateOne(userId, userData);

      return user;
    },
    deleteUser: async (_: any, variables: any, context: any) => {
      const userId = context.reply.request.body.variables.userId ?? variables.userId;
      const user = await userService.deleteOne(userId);

      return user;
    }
  }
};
//

export default async (fastify: FastifyInstance) => {
  fastify.register(apiV3, { prefix: "/v3" });
  fastify.register(gql, { schema, resolvers });

  fastify.post("/gql", async (request, reply) => {
    const { query } = request.body;

    return reply.graphql(query);
  });
};
