import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => ({ urma: "get guilds" }));
  fastify.post("/", async () => ({ urma: "post guild" }));

  fastify.get("/:guildId", async () => ({ urma: "get guild by id" }));
  fastify.patch("/:guildId", async () => ({ urma: "patch guild" }));
  fastify.delete("/:guildId", async () => ({ urma: "delete guild" }));
};
