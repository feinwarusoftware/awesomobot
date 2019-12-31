import { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";

import apiV3 from "./api/v3";
import discordAuth from "./auth/discord";

export default async (fastify: FastifyInstance) => {
  fastify.register(fastifyCookie, { secret: "rawrxd" });

  fastify.register(apiV3, { prefix: "/api/v3" });
  fastify.register(discordAuth, { prefix: "/auth/discord" });

  fastify.get("/", async () => "rawrxd");
};
