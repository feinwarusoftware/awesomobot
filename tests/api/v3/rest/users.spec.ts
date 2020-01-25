import buildFastify from "../../../../src/api/buildFastify";
import { connect, userService } from "../../../../src/lib/db";
import { IUserInput } from "../../../../src/lib/db/types";

const kDiscordUserData: IUserInput = {
  discord_id: "168690518899949569",

  banner: "https://cdn.discordapp.com/attachments/512050258222776321/668446392217370624/rl6ddfr4jpb41.png",
  bio: "uppa ra lmao",
  socials: [{
    name: "reddit",
    icon: "reddit?",
    url: "https://www.reddit.com/user/dragon1320/",
  }],
  modules: [{
    name: "",
    enabled: true,
    content: [
      "idk whats supposed to go here lel",
    ],
  }],
  colours: {
    // heliotrope
    progress: "#df73ff",
    // ultramarine
    level: "#120a8f",
    // colour of dying leaves
    rank: "#cc9966",
    // vermillion
    name: "#e34234",
  },

  admin: true,
  verified: true,
  developer: true,
  tier: "free",
  premium: [
    "_dummyId",
  ],

  xp: 777,
  shits: 69,
  // This *might* be an enum in the db schema, if its not, it should be
  trophies: [
    "_dummyTrophy",
  ],

  likes: [
    "_dummyId",
  ],
};

const kDiscordUserId = "112668272515670016";

describe("REST ApiV3 User Endpoints", () => {
  const fastify = buildFastify();

  let savedUser = null;

  // Connect to the test database
  beforeAll(async done => {
    await connect("awnext_test");

    done();
  });

  // Need to call done as well as this doesnt *really* support async
  beforeEach(async done => {
    savedUser = await userService.saveOne(kDiscordUserData);

    done();
  });

  afterEach(async done => {
    await userService.deleteOne(savedUser._id); // eslint-disable-line no-underscore-dangle

    done();
  });

  // Test that all routes work as intended
  describe("Test basic functionality", async () => {
    it("GET /users", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/api/v3/users",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toEqual(kDiscordUserData);
    });
    it("POST /users", async () => {

    });

    it("GET /users/me", async () => {

    });

    it("GET /users/:userId", async () => {

    });
    it("PATCH /users/:userId", async () => {

    });
    it("DELETE /users/:userId", async () => {

    });
  });
});
