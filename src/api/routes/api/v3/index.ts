import { FastifyInstance } from "fastify";
import gql from "fastify-gql";
import fastifyCors from "fastify-cors";

import { verifyDiscordAuth } from "../../../middleware";

import {
  guildHandler,
  guildScriptHandler,
  scriptHandler,
  userHandler,
} from "./handlers";

import { schema, resolvers } from "./graphql";

export default async (fastify: FastifyInstance) => {
  fastify.register(fastifyCors, {
    origin: "*",
  });

  fastify.addHook("preHandler", verifyDiscordAuth);

  fastify.register(guildHandler, { prefix: "/guilds" });
  fastify.register(guildScriptHandler, { prefix: "/guilds/:guildId/scripts" });
  fastify.register(scriptHandler, { prefix: "/scripts" });
  fastify.register(userHandler, { prefix: "/users" });

  fastify.register(gql, { schema, resolvers });
  fastify.post("/gql", async (request, reply) => {
    const { query } = request.body;

    return reply.graphql(query);
  });
};
