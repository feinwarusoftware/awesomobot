import { FastifyInstance } from "fastify";

import { guildScriptService } from "../../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async request => {
    const guildScripts = await guildScriptService.getMany(request.params.guildId);

    return {
      success: true,
      data: guildScripts,
    };
  });
  fastify.post("/", async request => {
    const guildScript = await guildScriptService.saveOne(request.params.guildId, request.body);

    return {
      success: true,
      data: guildScript,
    };
  });

  fastify.get("/:scriptId", async request => {
    const guildScript = await guildScriptService.getOneById(request.params.guildId, request.params.scriptId);

    return {
      success: true,
      data: guildScript,
    };
  });
  fastify.patch("/:scriptId", async request => {
    const info = await guildScriptService.updateOne(request.params.guildId, request.params.scriptId, request.body);

    return {
      success: true,
      data: info,
    };
  });
  fastify.delete("/:scriptId", async request => {
    const info = await guildScriptService.deleteOne(request.params.guildId, request.params.scriptId);

    return {
      success: true,
      data: info,
    };
  });
};
