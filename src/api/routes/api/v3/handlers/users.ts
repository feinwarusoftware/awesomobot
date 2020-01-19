import { FastifyInstance } from "fastify";

import { userService } from "../../../../../lib/db";
import { fetchDiscordUser } from "../../../../helpers";
import { verifyDiscordAuth } from "../../../../middleware";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await userService.getMany();

    return {
      success: true,
      data: users,
    };
  });
  fastify.post("/", async (request, reply) => {
    const user = await userService.saveOne(request.body);

    reply.code(201);

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

  // temp
  fastify.get("/@me", { preHandler: verifyDiscordAuth }, async function () {
    const user = await userService.getOne({
      discord_id: this.session.id,
    });

    const discordUserData = await fetchDiscordUser(this.session.access_token);
    // Remove the 'id' property as were calling it 'discord_id' instead
    Reflect.deleteProperty(discordUserData, "id");

    return {
      success: true,
      data: {
        ...user,
        ...discordUserData,
      },
    };
  });
};
