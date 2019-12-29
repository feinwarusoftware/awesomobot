import userSchema from "./user";

// extending types is broke for some reason, so this is the next best way...
const schema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    test(input: Int!): Int

    users: [User]
    user(userId: ID!): User
  }

  type Mutation {
    test(input: Int!): Int

    addUser(userData: UserInput): User
    updateUser(userId: ID!, userData: UserInput!): User
    deleteUser(userId: ID!, userData: UserInput!): User
  }
`;

export default [
  schema,
  userSchema,
].join("");
