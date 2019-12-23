import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => ({ urma: "get guild script" }));
  fastify.post("/", async () => ({ urma: "post guild script" }));

  fastify.get("/:scriptId", async () => ({ urma: "get guild script by id" }));
  fastify.patch("/:scriptId", async () => ({ urma: "patch guild script" }));
  fastify.delete("/:scriptId", async () => ({ urma: "delete guild script" }));
};
