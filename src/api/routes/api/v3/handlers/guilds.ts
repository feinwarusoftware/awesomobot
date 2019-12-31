import { FastifyInstance } from "fastify";

import { guildService } from "../../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const guilds = await guildService.getMany();

    return {
      success: true,
      data: guilds,
    };
  });
  fastify.post("/", async request => {
    const guild = await guildService.saveOne(request.body);

    return {
      success: true,
      data: guild,
    };
  });

  fastify.get("/:guildId", async request => {
    const guild = await guildService.getOneById(request.params.userId);

    return {
      success: true,
      data: guild,
    };
  });
  fastify.patch("/:guildId", async request => {
    const info = await guildService.updateOne(request.params.userId, request.body);

    return {
      success: true,
      data: info,
    };
  });
  fastify.delete("/:guildId", async request => {
    const info = await guildService.deleteOne(request.params.userId);

    return {
      success: true,
      data: info,
    };
  });
};
