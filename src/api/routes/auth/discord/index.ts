import { FastifyInstance } from "fastify";
import oauthPlugin from "fastify-oauth2";

import { sessionService } from "../../../../lib/db";
import { fetchDiscordUser, jwtSign } from "../../../helpers";

const discordId = process.env.DISCORD_BOT_ID;
const discordSecret = process.env.DISCORD_BOT_SECRET;
const discordCallback = process.env.DISCORD_BOT_CALLBACK;

export default async (fastify: FastifyInstance) => {
  fastify.register(oauthPlugin, {
    name: "discordOAuth2",
    credentials: {
      client: {
        id: discordId,
        secret: discordSecret,
      },
      auth: {
        authorizeHost: "https://discordapp.com",
        authorizePath: "/api/v6/oauth2/authorize",
        tokenHost: "https://discordapp.com",
        tokenPath: "/api/v6/oauth2/token",
      }
    },
    startRedirectPath: "/",
    callbackUri: discordCallback,
    scope: "guilds.join identify",
  });

  fastify.get("/callback", async function (request, response) {
    const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    Reflect.deleteProperty(token, "iat");

    const user = await fetchDiscordUser(token.access_token);

    // For maxAge; use the discord expires_in date (provided in seconds)
    // and take an hour away just to be sure (discord doesnt document
    // how strict they are with this)
    response.setCookie("session", jwtSign({
      id: user.id,
      ...token
    }), {
      maxAge: token.expires_in - 60,
      httpOnly: true,
      sameSite: true,
      path: "/",
    });

    response.redirect("/");
  });
};
