const buildFastify = require("../build/api/buildFastify");
const { connect, guildService, scriptService, userService, guildScriptService } = require("../build/lib/db");

const kDiscordUserId = "112668272515670016";
const kAltDiscordUserId = "215982178046181376";
const kAlt2DiscordUserId = "168690518899949569";

const kDiscordGuildId = "593204269692354574";
const kAltDiscordGuildId = "438701535208275978";
const kAlt2DiscordGuildId = "405129031445381120";

const kScriptName = "rawrxd";
const kScriptMatch = "rawrxd";
const kScriptCreatedWith = "tests";

const kUserBio = "hmmmm";
const kScriptHelp = "idk";
const kGuildPrefix = "<<";

describe("REST ApiV3 Endpoints", () => {
  const fastify = buildFastify();

  let savedUserId = null;
  let savedScriptId = null;
  let savedGuildId = null;

  beforeAll(async done => {
    await connect(process.env.NODE_ENV);

    // seed the database
    const { _id: userId } = await userService.saveOne({
      discord_id: kDiscordUserId,
    });
    savedUserId = userId;

    const { _id: scriptId } = await scriptService.saveOne({
      author_id: userId,
      name: kScriptName,
      match: kScriptMatch,
      created_with: kScriptCreatedWith,
    });
    savedScriptId = scriptId;

    const { _id: guildId } = await guildService.saveOne({
      discord_id: kDiscordGuildId,
    });
    savedGuildId = guildId;

    await guildScriptService.saveOne(guildId, {
      object_id: scriptId,
    });

    done();
  });

  afterAll(() => {
    fastify.close();
  });

  describe("Get Endpoints", () => {
    it("User", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/api/v3/users/${savedUserId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Multiple Users", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/api/v3/users",
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Script", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/api/v3/scripts/${savedScriptId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Multiple Scripts", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/api/v3/scripts",
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Guild", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/api/v3/guilds/${savedGuildId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Multiple Guilds", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/api/v3/guilds",
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Script Guild", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/api/v3/guilds/${savedGuildId}/scripts/${savedScriptId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Multiple Script Guilds", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/api/v3/guilds/${savedGuildId}/scripts`,
      });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Post Endpoints", () => {
    let savedAltScriptId = null;

    beforeAll(async done => {
      // add another script to prevent duplication when adding it
      // to a guild (current one already added when seeding the db)
      const { _id: scriptId } = await scriptService.saveOne({
        author_id: savedUserId,
        name: kScriptName,
        match: kScriptMatch,
        created_with: kScriptCreatedWith,
      });
      savedAltScriptId = scriptId;

      done();
    });

    it("User", async () => {
      const res = await fastify.inject({
        method: "POST",
        url: "/api/v3/users",
        payload: {
          discord_id: kAltDiscordUserId,
        },
      });

      expect(res.statusCode).toEqual(201);
    });

    it("Script", async () => {
      const res = await fastify.inject({
        method: "POST",
        url: "/api/v3/scripts",
        payload: {
          author_id: savedUserId,
          name: kScriptName,
          match: kScriptMatch,
          created_with: kScriptCreatedWith,
        },
      });

      expect(res.statusCode).toEqual(201);
    });

    it("Guild", async () => {
      const res = await fastify.inject({
        method: "POST",
        url: "/api/v3/guilds",
        payload: {
          discord_id: kAltDiscordGuildId,
        },
      });

      expect(res.statusCode).toEqual(201);
    });

    it("GuildScript", async () => {
      const res = await fastify.inject({
        method: "POST",
        url: `/api/v3/guilds/${savedGuildId}/scripts`,
        payload: {
          object_id: savedAltScriptId,
        },
      });

      expect(res.statusCode).toEqual(201);
    });
  });

  describe("Patch Endpoints", () => {
    it("User", async () => {
      const res = await fastify.inject({
        method: "PATCH",
        url: `/api/v3/users/${savedUserId}`,
        payload: {
          bio: kUserBio,
        },
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Script", async () => {
      const res = await fastify.inject({
        method: "PATCH",
        url: `/api/v3/scripts/${savedScriptId}`,
        payload: {
          match: kScriptHelp,
        },
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Guild", async () => {
      const res = await fastify.inject({
        method: "PATCH",
        url: `/api/v3/guilds/${savedGuildId}`,
        payload: {
          prefix: kGuildPrefix,
        },
      });

      expect(res.statusCode).toEqual(200);
    });

    it("GuildScript", async () => {
      const res = await fastify.inject({
        method: "PATCH",
        url: `/api/v3/guilds/${savedGuildId}/scripts/${savedScriptId}`,
        payload: {
          permissions: {
            enabled: true,
          },
        },
      });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Delete Endpoints", () => {
    // add another script to prevent duplication when adding it
    // to a guild (current one already added when seeding the db)
    let savedAltUserId = null;
    let savedAltScriptId = null;
    let savedAltGuildId = null;

    beforeAll(async done => {
      await connect(process.env.NODE_ENV);

      // seed the database
      const { _id: userId } = await userService.saveOne({
        discord_id: kAlt2DiscordUserId,
      });
      savedAltUserId = userId;

      const { _id: scriptId } = await scriptService.saveOne({
        author_id: userId,
        name: kScriptName,
        match: kScriptMatch,
        created_with: kScriptCreatedWith,
      });
      savedAltScriptId = scriptId;

      const { _id: guildId } = await guildService.saveOne({
        discord_id: kAlt2DiscordGuildId,
      });
      savedAltGuildId = guildId;

      await guildScriptService.saveOne(guildId, {
        object_id: scriptId,
      });

      done();
    });

    it("User", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: `/api/v3/users/${savedAltUserId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Script", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: `/api/v3/scripts/${savedAltScriptId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Guild", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: `/api/v3/guilds/${savedAltGuildId}`,
      });

      expect(res.statusCode).toEqual(200);
    });

    it("GuildScript", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: `/api/v3/guilds/${savedAltGuildId}/scripts/${savedAltScriptId}`,
      });

      expect(res.statusCode).toEqual(200);
    });
  });
});
