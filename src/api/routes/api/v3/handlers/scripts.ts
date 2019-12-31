import { FastifyInstance } from "fastify";

import { scriptService } from "../../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const scripts = await scriptService.getMany();

    return {
      success: true,
      data: scripts,
    };
  });
  fastify.post("/", async request => {
    const script = await scriptService.saveOne(request.body);

    return {
      success: true,
      data: script,
    };
  });

  fastify.get("/:scriptId", async request => {
    const script = await scriptService.getOneById(request.params.userId);

    return {
      success: true,
      data: script,
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
