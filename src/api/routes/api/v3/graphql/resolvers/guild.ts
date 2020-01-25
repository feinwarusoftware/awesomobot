import { guildService } from "../../../../../../lib/db";

export default {
  Query: {
    guilds: async () => {
      const guilds = await guildService.getMany();

      return guilds;
    },
    guild: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guild = await guildService.getOneById(guildId);

      return guild;
    }
  },
  Mutation: {
    addGuild: async (_: any, variables: any, context: any) => {
      const guildData = context.reply.request.body.variables.guildData ?? variables.guildData;
      const guild = await guildService.saveOne(guildData);

      return guild;
    },
    updateGuild: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildData = context.reply.request.body.variables.guildData ?? variables.guildData;
      const info = await guildService.updateOne(guildId, guildData);

      return info;
    },
    deleteGuild: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const info = await guildService.deleteOne(guildId);

      return info;
    }
  }
};
