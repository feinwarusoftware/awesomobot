import { FastifyInstance } from "fastify";

import apiV3 from "./v3";

export default async (fastify: FastifyInstance) => {
  fastify.register(apiV3, { prefix: "/v3" });
};
