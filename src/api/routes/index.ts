import { FastifyInstance } from "fastify";

import apiV4 from "./v4";

export default async (fastify: FastifyInstance) => {
  fastify.register(apiV4, { prefix: "/v4" });
};
