import { Client } from "discord.js";

const kDiscordBotToken = process.env.DISCORD_BOT_TOKEN;

const discordClient = new Client({
  fetchAllMembers: true,
});

// return the client instance afterwards so all the other
// functions dont have to access the global variable
const clientPromise = discordClient
  .login(kDiscordBotToken)
  .then(() => discordClient);

// fetches the discord user using the bots credentials
const fetchUser = async (discordId: string, cache = true) => {
  const client = await clientPromise;

  const user = await client.fetchUser(discordId, cache);
  return user;
};

export {
  fetchUser,
};
