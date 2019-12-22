export default async (fastify, opts) => {
  fastify.register(require("./v3"), { prefix: "/v3" });
};
