import { FastifyInstance } from "fastify";

import { userService } from "../../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await userService.getMany();

    return {
      success: true,
      data: users,
    };
  });
  fastify.post("/", async request => {
    const user = await userService.saveOne(request.body);

    return {
      success: true,
      data: user,
    };
  });

  fastify.get("/:userId", async request => {
    const user = await userService.getOneById(request.params.userId);

    return {
      success: true,
      data: user,
    };
  });
  fastify.patch("/:userId", async request => {
    const info = await userService.updateOne(request.params.userId, request.body);

    return {
      success: true,
      data: info,
    };
  });
  fastify.delete("/:userId", async request => {
    const info = await userService.deleteOne(request.params.userId);

    return {
      success: true,
      data: info,
    };
  });
};
