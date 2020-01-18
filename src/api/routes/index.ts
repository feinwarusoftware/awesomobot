import { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyStatic from "fastify-static";
import path from "path";

import { verifyDiscordAuth } from "../middleware";

import apiV3 from "./api/v3";
import apiVN from "./api/vn";
import discordAuth from "./auth/discord";

export default async (fastify: FastifyInstance) => {
  fastify.register(fastifyCookie, { secret: "rawrxd" });
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "temp"),
  });

  fastify.register(apiV3, { prefix: "/api/v3" });
  fastify.register(apiVN, { prefix: "/api/vn" });
  fastify.register(discordAuth, { prefix: "/auth/discord" });

  fastify.get("/", async (request, reply) => reply.sendFile("index.html"));
  fastify.get("/p", { preHandler: verifyDiscordAuth }, async function () {
    return this.session;
  });
};
