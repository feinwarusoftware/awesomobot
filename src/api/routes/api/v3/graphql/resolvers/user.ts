import { userService } from "../../../../../../lib/db";
import { fetchDiscordUser } from "../../../../../helpers";
import { fetchUser } from "../../../../../../bot/client";

// IF YOU WERE WONDERING, **YES** THIS CODE DUPLICATION *IS*
// SLOWLY KILLING ME ON THE INSIDE
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

export default {
  Query: {
    users: async () => {
      const users = await userService.getMany();

      const [...discordUsers] = await Promise.all(users.map((e: any) => fetchUser(e.discord_id).catch(() => ({ id: "unknown", username: "unknown" }))));

      return users.map((e: any, i: number) => ({ ...e, ...objectSelect(discordUsers[i], responseUserProps) }));
    },
    // Note: changing responseUserProps will require a change in the gql schema :(
    user: async (_: any, variables: any, context: any) => {
      const userId = context.reply.request.body.variables?.userId ?? variables?.userId;

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
        ...dbUser || {},
        ...objectSelect(discordUser || {}, responseUserProps),
      };
    },

    // Note: changing responseUserProps will require a change in the gql schema :(
    // will crash if user not logged in
    me: async (_: any, variables: any, context: any) => {
      const { id: userId, access_token: accessToken } = context.app.session;

      // if we cant find a user in the database, proceed as normal but
      // only display the stuff that we can get from the discord api
      const user = await userService.getOne({
        discord_id: userId,
      }) || { discord_id: userId };

      // remove outdated cache items
      discordUserCache = discordUserCache.filter(e => new Date().getTime() - new Date(e.fetched_at).getTime() < discordUserCacheDuration); 

      // get the cached value or fetch a new one and add it to the cache
      const cachedDiscordUser = discordUserCache.find(e => e.id === user.discord_id);

      let discordUserData = null;
      if (cachedDiscordUser == null) {
        discordUserData = await fetchDiscordUser(accessToken);

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
        ...user,
        ...objectSelect(discordUserData, responseUserProps),
      };
    }
  },
  Mutation: {
    addUser: async (_: any, variables: any, context: any) => {
      const userData = context.reply.request.body.variables.userData ?? variables.userData;
      const user = await userService.saveOne(userData);

      return user;
    },
    updateUser: async (_: any, variables: any, context: any) => {
      const userId = context.reply.request.body.variables.userId ?? variables.userId;
      const userData = context.reply.request.body.variables.userData ?? variables.userData;
      const info = await userService.updateOne(userId, userData);

      return info;
    },
    deleteUser: async (_: any, variables: any, context: any) => {
      const userId = context.reply.request.body.variables.userId ?? variables.userId;
      const info = await userService.deleteOne(userId);

      return info;
    }
  }
};
