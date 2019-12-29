import userResolver from "./user";

export default {
  Query: {
    ...{
      test: async (_: any, { input }: any) => input,
    },
    ...userResolver.Query,
  },
  Mutation: {
    ...{
      test: async (_: any, { input }: any) => input,
    },
    ...userResolver.Mutation,
  },
};
