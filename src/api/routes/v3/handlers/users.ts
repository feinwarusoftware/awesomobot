import { FastifyInstance } from "fastify";

import { userService } from "../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await userService.getMany();

    return users;
  });
  fastify.post("/", async request => {
    const user = await userService.saveOne(request.body);

    return user;
  });

  fastify.get("/:userId", async request => {
    const user = await userService.getOneById(request.params.userId);

    return user;
  });
  fastify.patch("/:userId", async request => {
    const user = await userService.updateOne(request.params.userId, request.body);

    return user;
  });
  fastify.delete("/:userId", async request => {
    const user = await userService.deleteOne(request.params.userId);

    return user;
  });
};
