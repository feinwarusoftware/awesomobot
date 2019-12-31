import { guildService } from "../../../../../../lib/db";

export default {
  Query: {
    users: async () => {
      const guilds = await guildService.getMany();

      return guilds;
    },
    user: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guild = await guildService.getOneById(guildId);

      return guild;
    }
  },
  Mutation: {
    addUser: async (_: any, variables: any, context: any) => {
      const guildData = context.reply.request.body.variables.guildData ?? variables.guildData;
      const guild = await guildService.saveOne(guildData);

      return guild;
    },
    updateUser: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildData = context.reply.request.body.variables.guildData ?? variables.guildData;
      const info = await guildService.updateOne(guildId, guildData);

      return info;
    },
    deleteUser: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const info = await guildService.deleteOne(guildId);

      return info;
    }
  }
};
