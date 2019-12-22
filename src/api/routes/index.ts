export default async (fastify, opts) => {
  fastify.register(import("./v3"), { prefix: "/v3" });
};
