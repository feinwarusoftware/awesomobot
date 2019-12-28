import { FastifyInstance } from "fastify";

import {
  guildHandler,
  guildScriptHandler,
  scriptHandler,
  userHandler,
} from "./handlers";

export default async (fastify: FastifyInstance) => {
  fastify.register(guildHandler, { prefix: "/guilds" });
  fastify.register(guildScriptHandler, { prefix: "/guilds/:guildId/scripts" });
  fastify.register(scriptHandler, { prefix: "/scripts" });
  fastify.register(userHandler, { prefix: "/users" });

  fastify.get("/test", async () => ({ urma: true }));
};
