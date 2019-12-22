export default async (fastify, opts) => {
  fastify.get("/test", async (request, reply) => {
    return { urma: true };
  });
};
