import { userService } from "../../../../../lib/db";

export default {
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
