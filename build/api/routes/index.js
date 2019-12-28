"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_gql_1 = __importDefault(require("fastify-gql"));
const v3_1 = __importDefault(require("./v3"));
const db_1 = require("../../lib/db");
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
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield db_1.userService.getMany();
            return users;
        }),
        user: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.userService.getOneById(userId);
            return user;
        })
    },
    Mutation: {
        addUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const userData = (_a = context.reply.request.body.variables.userData, (_a !== null && _a !== void 0 ? _a : variables.userData));
            const user = yield db_1.userService.saveOne(userData);
            return user;
        }),
        updateUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            const userId = (_b = context.reply.request.body.variables.userId, (_b !== null && _b !== void 0 ? _b : variables.userId));
            const userData = (_c = context.reply.request.body.variables.userData, (_c !== null && _c !== void 0 ? _c : variables.userData));
            const user = yield db_1.userService.updateOne(userId, userData);
            return user;
        }),
        deleteUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const userId = (_d = context.reply.request.body.variables.userId, (_d !== null && _d !== void 0 ? _d : variables.userId));
            const user = yield db_1.userService.deleteOne(userId);
            return user;
        })
    }
};
//
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(v3_1.default, { prefix: "/v3" });
    fastify.register(fastify_gql_1.default, { schema, resolvers });
    fastify.post("/gql", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = request.body;
        return reply.graphql(query);
    }));
});
//# sourceMappingURL=index.js.map