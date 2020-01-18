import { FastifyInstance } from "fastify";

// import { userService } from "../../../../lib/db";
import { fetchMembers, fetchGuilds, fetchMessages, retrieveMessages } from "../../../../bot/client";

export default async (fastify: FastifyInstance) => {  
  fastify.get("/", async () => ({
    info: "awesomo next:tm: api (hence vn)",
  }));

  fastify.get("/guilds", async request => {
    const { query, limit } = request.query;

    const guilds = await fetchGuilds(query, limit);

    return guilds.map(e => ({
      id: e.id,
      name: e.name,
    }));
  });

  fastify.get("/guilds/:guildId/members", async request => {
    const { guildId } = request.params;
    const { query, limit } = request.query;

    const members = await fetchMembers(guildId, query, limit);

    return members.map(e => ({
      id: e.id,
      nickname: e.nickname,
      user: {
        username: e.user.username,
        displayAvatarURL: e.user.displayAvatarURL,
      },
    }));
  });

  fastify.get("/guilds/:guildId/channels/:channelId/messages/fetch", async request => {
    const { guildId, channelId } = request.params;
    const { count } = request.query;

    fetchMessages(guildId, channelId, count);

    return {
      ok: true,
    };
  });

  fastify.get("/guilds/:guildId/channels/:channelId/messages/status", async request => {
    const { guildId, channelId } = request.params;

    return {
      ok: true,
    };
  });

  fastify.get("/guilds/:guildId/channels/:channelId/messages", async request => {
    const { guildId, channelId } = request.params;

    const messages = await retrieveMessages(guildId, channelId);

    return messages.map(e => ({
      id: e.id,
      createdAt: e.createdAt,
    }));
  });
};
