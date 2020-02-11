import { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";
// import fastifyStatic from "fastify-static";
// import path from "path";
import { ApolloServer, gql } from "apollo-server-fastify";

import { verifyDiscordAuth } from "../middleware";

import apiV3 from "./api/v3";
// import apiVN from "./api/vn";
import discordAuth from "./auth/discord";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

import { GuildResolver, ScriptResolver, UserResolver } from "./graphql";

// const cookieSecret = process.env.COOKIE_SECRET;

export default async (fastify: FastifyInstance) => {

  const schema = await buildSchema({
    resolvers: [
      GuildResolver,
      ScriptResolver,
      UserResolver,
    ],
    container: Container,
  });

  const gqlServer = new ApolloServer({
    schema,
  });

  // doing cookie stuff in buildFastify.ts instead
  // fastify.register(fastifyCookie, { secret: cookieSecret });
  // fastify.register(fastifyStatic, {
  //   root: path.join(__dirname, "..", "temp"),
  // });

  // fastify.register(apiV3, { prefix: "/api/v3" });
  // temp disabled for securoty reasons
  // fastify.register(apiVN, { prefix: "/api/vn" });
  fastify.register(discordAuth, { prefix: "/auth/discord" });

  // fastify.get("/", async (request, reply) => reply.sendFile("index.html"));
  // fastify.get("/p", { preHandler: verifyDiscordAuth }, async function () {
  //   return this.session;
  // });

  fastify.register(gqlServer.createHandler());
};
