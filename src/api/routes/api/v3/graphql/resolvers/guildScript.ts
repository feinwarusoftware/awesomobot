import { guildScriptService } from "../../../../../../lib/db";

export default {
  Query: {
    guildScripts: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildScripts = await guildScriptService.getMany(guildId);

      return guildScripts;
    },
    guildScript: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildScriptId = context.reply.request.body.variables.guildScriptId ?? variables.guildScriptId;
      const guildScript = await guildScriptService.getOneById(guildId, guildScriptId);

      return guildScript;
    }
  },
  Mutation: {
    addGuildScript: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildScriptData = context.reply.request.body.variables.guildScriptData ?? variables.guildScriptData;
      const guildScript = await guildScriptService.saveOne(guildId, guildScriptData);

      return guildScript;
    },
    updateGuildScript: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildScriptId = context.reply.request.body.variables.guildScriptId ?? variables.guildScriptId;
      const guildScriptData = context.reply.request.body.variables.guildScriptData ?? variables.guildScriptData;
      const info = await guildScriptService.updateOne(guildId, guildScriptId, guildScriptData);

      return info;
    },
    deleteGuildScript: async (_: any, variables: any, context: any) => {
      const guildId = context.reply.request.body.variables.guildId ?? variables.guildId;
      const guildScriptId = context.reply.request.body.variables.guildScriptId ?? variables.guildScriptId;
      const info = await guildScriptService.deleteOne(guildId, guildScriptId);

      return info;
    }
  }
};
