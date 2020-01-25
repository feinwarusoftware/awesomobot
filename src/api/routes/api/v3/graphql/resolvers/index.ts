import guildResolver from "./guild";
import guildScriptResolver from "./guildScript";
import scriptResolver from "./script";
import userResolver from "./user";

export default {
  Query: {
    ...guildResolver.Query,
    ...guildScriptResolver.Query,
    ...scriptResolver.Query,
    ...userResolver.Query,
  },
  Mutation: {
    ...guildResolver.Mutation,
    ...guildScriptResolver.Mutation,
    ...scriptResolver.Mutation,
    ...userResolver.Mutation,
  },
};
