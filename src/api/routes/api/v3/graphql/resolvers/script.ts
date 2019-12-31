import { scriptService } from "../../../../../../lib/db";

export default {
  Query: {
    users: async () => {
      const scripts = await scriptService.getMany();

      return scripts;
    },
    user: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables.scriptId ?? variables.scriptId;
      const script = await scriptService.getOneById(scriptId);

      return script;
    }
  },
  Mutation: {
    addUser: async (_: any, variables: any, context: any) => {
      const scriptData = context.reply.request.body.variables.scriptData ?? variables.scriptData;
      const script = await scriptService.saveOne(scriptData);

      return script;
    },
    updateUser: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables.scriptId ?? variables.scriptId;
      const scriptData = context.reply.request.body.variables.scriptData ?? variables.scriptData;
      const info = await scriptService.updateOne(scriptId, scriptData);

      return info;
    },
    deleteUser: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables.scriptId ?? variables.scriptId;
      const info = await scriptService.deleteOne(scriptId);

      return info;
    }
  }
};
