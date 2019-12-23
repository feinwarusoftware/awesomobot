import { FastifyInstance } from "fastify";

import { userService } from "../../../../lib/db";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await userService.getMany();

    return users;
  });
  fastify.post("/", async () => ({ urma: "post user" }));

  fastify.get("/:userId", async () => ({ urma: "get user by id" }));
  fastify.patch("/:userId", async () => ({ urma: "patch user" }));
  fastify.delete("/:userId", async () => ({ urma: "delete user" }));
};
