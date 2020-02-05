import { FastifyInstance } from "fastify";
import { User } from "discord.js";

import { userService } from "../../../../../lib/db";
import { fetchDiscordUser } from "../../../../helpers";
import { verifyDiscordAuth } from "../../../../middleware";
import { fetchUser } from "../../../../../bot/client";

const kDiscordIdLength = 18;

// Props of the user object returned from discord to send with the api response
const responseUserProps = ["username"];

// We only care about some user params, we dont want to cahe
// or send them all, id is required for caching logicm anything else is optional
// the optional elements are dictated by responseUserProps
interface IUserResponse {
  id: string,
}

// In case the @me route is called multiple times in quick succession
// Cache for 1 minute - this is how long it takes for the rate limit to refresh
interface ICachedUserResponse extends IUserResponse {
  fetched_at: Date,
}

const discordUserCacheDuration = 10 * 1000;
let discordUserCache: ICachedUserResponse[] = [];

const objectSelect = (source: object, props: string[]): object => Object.fromEntries(Object.entries(source).filter(([key]) => props.includes(key)));

export default async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const users = await userService.getMany();

    const [...discordUsers] = await Promise.all(users.map((e: any) => fetchUser(e.discord_id).catch(() => ({ id: "unknown", username: "unknown" }))));

    return {
      success: true,
      data: users.map((e: any, i: number) => ({ ...e, ...objectSelect(discordUsers[i], responseUserProps) })),
    };
  });
  fastify.post("/", async (request, reply) => {
    const user = await userService.saveOne(request.body);

    reply.code(201);

    return {
      success: true,
      data: user,
    };
  });

  // let discordjs handle the caching for this route
  fastify.get("/:userId", async request => {
    const { userId } = request.params;

    // I know this is a bad way to handle this but...
    // determine if its a mongo id or not by its length
    // a mongo id is 24 chars
    const isDiscordId = userId.length === kDiscordIdLength;

    let dbUser = null;
    let discordUser = null;

    if (isDiscordId) {
      const dbUserPromise = userService.getOne({
        discord_id: userId, 
      });
      const discordUserPromise = fetchUser(userId).catch(() => ({ id: "unknown", username: "unknown" }));

      [dbUser, discordUser] = await Promise.all([dbUserPromise, discordUserPromise]);
    } else {
      dbUser = await userService.getOneById(userId);

      // if theres not discord id specified and we cant get
      // one from our db, we cant return anything
      if (dbUser == null) {
        return {
          success: false,
          data: null,
        }
      }

      discordUser = await fetchUser(dbUser.discord_id).catch(() => ({ id: "unknown", username: "unknown" }));
    }

    return {
      success: true,
      data: {
        ...dbUser || {},
        ...objectSelect(discordUser || {}, responseUserProps),
      },
    };
  });
  fastify.patch("/:userId", async request => {
    const info = await userService.updateOne(request.params.userId, request.body);

    return {
      success: true,
      data: info,
    };
  });
  fastify.delete("/:userId", async request => {
    const info = await userService.deleteOne(request.params.userId);

    return {
      success: true,
      data: info,
    };
  });

  // temp
  fastify.get("/me", { preHandler: verifyDiscordAuth }, async function () {

    // if we cant find a user in the database, proceed as normal but
    // only display the stuff that we can get from the discord api
    const user = await userService.getOne({
      discord_id: this.session.id,
    }) || { discord_id: this.session.id };

    // remove outdated cache items
    discordUserCache = discordUserCache.filter(e => new Date().getTime() - new Date(e.fetched_at).getTime() < discordUserCacheDuration); 

    // get the cached value or fetch a new one and add it to the cache
    const cachedDiscordUser = discordUserCache.find(e => e.id === user.discord_id);

    let discordUserData = null;
    if (cachedDiscordUser == null) {
      discordUserData = await fetchDiscordUser(this.session.access_token);

      // id is required
      discordUserCache.push({
        id: discordUserData.id,
        ...objectSelect(discordUserData, responseUserProps),
        fetched_at: new Date(),
      });
    } else {

      discordUserData = cachedDiscordUser;
    }

    // Remove the 'id' property as were calling it 'discord_id' instead
    // Reflect.deleteProperty(discordUserData, "id");

    return {
      success: true,
      data: {
        ...user,
        ...objectSelect(discordUserData, responseUserProps),
      },
    };
  });
};
