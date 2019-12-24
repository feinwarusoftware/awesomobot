import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => ({ urma: "get scripts" }));
  fastify.post("/", async () => ({ urma: "post script" }));

  fastify.get("/:scriptId", async () => ({ urma: "get script by id" }));
  fastify.patch("/:scriptId", async () => ({ urma: "patch script" }));
  fastify.delete("/:scriptId", async () => ({ urma: "delete script" }));
};
