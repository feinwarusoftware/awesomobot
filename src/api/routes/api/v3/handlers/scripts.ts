import { FastifyInstance } from "fastify";

import { scriptService, userService } from "../../../../../lib/db";
import { fetchUser } from "../../../../../bot/client";

// COPIED CODE FROM USERS.js- REFACTOR
// Props of the user object returned from discord to send with the api response
const responseUserProps = ["username"];

const objectSelect = (source: object, props: string[]): object => Object.fromEntries(Object.entries(source).filter(([key]) => props.includes(key)));
// END OF COPIED CODE

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async request => {
    const {
      author_id,
      name,
      featured,
      marketplace_enabled,
      verified,
      page,
      limit,
      sortField,
      sortDirection,
      with_ids,
    } = request.query;

    const filters = {
      author_id,
      name,
      featured,
      marketplace_enabled,
      verified,
      with_ids,
    };

    let scripts = await scriptService.getMany(filters, sortField, sortDirection, limit, page);

    // HOLY SHIT WHY IS 'feinwaru-devs' A THING?!?!

    // yes these can be fetched simultaneously, i know
    const [...dbUsers] = await Promise.all(scripts.list.map((e: any) => e.author_id === "feinwaru-devs" ? { verified: true } : userService.getOne({ discord_id: e.author_id })));
    const [...discordUsers] = await Promise.all(scripts.list.map((e: any) => e.author_id === "feinwaru-devs" ? { id: "feinwaru-devs", username: "Feinwaru" } : fetchUser(e.author_id).catch(() => ({ id: "unknown", username: "unknown" }))));

    return {
      success: true,

      // since promise.all data should be returned in the correct order,
      // we can just merge the discord user and script data
      data: {
        list: scripts.list.map((e: any, i: number) => ({ ...e, ...objectSelect(discordUsers[i], responseUserProps), ...{ user_verified: dbUsers[i]?.verified || false } })),
        total: scripts.total,
      }
    };
  });
  fastify.post("/", async (request, reply) => {
    const script = await scriptService.saveOne(request.body);

    reply.code(201);

    return {
      success: true,
      data: script,
    };
  });

  fastify.get("/:scriptId", async request => {
    const { scriptId } = request.params;

    // cool ts, but this shit returns something else sooo...
    const script = (await scriptService.getOneById(scriptId))?._doc;

    if (script == null) {
      return {
        success: false,
        data: null,
      }
    }

    const dbUser = script.author_id === "feinwaru-devs" ? { verified: true } : await userService.getOne({ discord_id: script.author_id });
    const discordUser = script.author_id === "feinwaru-devs" ? { id: "feinwaru-devs", username: "Feinwaru" } : await fetchUser(script.author_id).catch(() => ({ id: "unknown", username: "unknown" }));

    return {
      success: true,
      data: {
        ...script,
        ...objectSelect(discordUser, responseUserProps),
        ...{ user_verified: dbUser?.verified || false },
      },
    };
  });
  fastify.patch("/:scriptId", async request => {
    const info = await scriptService.updateOne(request.params.userId, request.body);

    return {
      success: true,
      data: info,
    };
  });
  fastify.delete("/:scriptId", async request => {
    const info = await scriptService.deleteOne(request.params.userId);

    return {
      success: true,
      data: info,
    };
  });
};
