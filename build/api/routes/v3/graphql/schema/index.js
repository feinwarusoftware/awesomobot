"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
// extending types is broke for some reason, so this is the next best way...
const schema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    users: [User]
    user(userId: ID!): User
  }

  type Mutation {
    addUser(userData: UserInput): User
    updateUser(userId: ID!, userData: UserInput!): User
    deleteUser(userId: ID!, userData: UserInput!): User
  }
`;
exports.default = [
    schema,
    user_1.default,
].join("");
//# sourceMappingURL=index.js.map