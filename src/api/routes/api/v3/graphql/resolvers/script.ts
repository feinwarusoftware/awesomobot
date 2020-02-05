import { scriptService } from "../../../../../../lib/db";
import { fetchUser } from "../../../../../../bot/client";

// COPIED CODE FROM USERS.js- REFACTOR
// Props of the user object returned from discord to send with the api response
const responseUserProps = ["username"];

const objectSelect = (source: object, props: string[]): object => Object.fromEntries(Object.entries(source).filter(([key]) => props.includes(key)));
// END OF COPIED CODE

export default {
  Query: {
    scripts: async (_: any, variables: any, context: any) => {
      // TODO: remove this!!! (temp shitty filters)
      const author_id = context.reply.request.body.variables?.author_id ?? variables?.author_id;
      const name = context.reply.request.body.variables?.name ?? variables?.name;
      const featured = context.reply.request.body.variables?.featured ?? variables?.featured;
      const marketplace_enabled = context.reply.request.body.variables?.marketplace_enabled ?? variables?.marketplace_enabled;
      const verified = context.reply.request.body.variables?.verified ?? variables?.verified;
      const page = context.reply.request.body.variables?.page ?? variables?.page;
      const limit = context.reply.request.body.variables?.limit ?? variables?.limit;
      const sortField = context.reply.request.body.variables?.sortField ?? variables?.sortField;
      const sortDirection = context.reply.request.body.variables?.sortDirection ?? variables?.sortDirection; 

      const filters = {
        author_id,
        name,
        featured,
        marketplace_enabled,
        verified,
      };

      const res = await scriptService.getMany(filters, sortField, sortDirection, limit, page);

      // HOLY SHIT WHY IS 'feinwaru-devs' A THING?!?!

      // const [...dbUsers] = await Promise.all(scripts.list.map((e: any) => e.author_id === "feinwaru-devs" ? new Promise(resolve => resolve({ discord_id: "feinwaru-devs" })) : userService.getOneById(e.author_id)));
      const [...discordUsers] = await Promise.all(res.list.map((e: any) => e.author_id === "feinwaru-devs" ? { id: "feinwaru-devs", username: "Feinwaru" } : fetchUser(e.author_id)));

      return {
        list: res.list.map((e: any, i: number) => ({ ...e, ...objectSelect(discordUsers[i], responseUserProps) })),
        total: res.total,
      };
    },
    script: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables?.scriptId ?? variables?.scriptId;

      // cool ts, but this shit returns something else sooo...
      const script = (await scriptService.getOneById(scriptId))?._doc;

      // if (script == null) {
      //   return {
      //     success: false,
      //     data: null,
      //   }
      // }
  
      const discordUser = script.author_id === "feinwaru-devs" ? { id: "feinwaru-devs", username: "Feinwaru" } : await fetchUser(script.author_id);

      return {
        ...script,
        ...objectSelect(discordUser, responseUserProps)
      };
    }
  },
  Mutation: {
    addScript: async (_: any, variables: any, context: any) => {
      const scriptData = context.reply.request.body.variables.scriptData ?? variables.scriptData;
      const script = await scriptService.saveOne(scriptData);

      return script;
    },
    updateScript: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables.scriptId ?? variables.scriptId;
      const scriptData = context.reply.request.body.variables.scriptData ?? variables.scriptData;
      const info = await scriptService.updateOne(scriptId, scriptData);

      return info;
    },
    deleteScript: async (_: any, variables: any, context: any) => {
      const scriptId = context.reply.request.body.variables.scriptId ?? variables.scriptId;
      const info = await scriptService.deleteOne(scriptId);

      return info;
    }
  }
};
