import { FastifyInstance } from "fastify";
import oauthPlugin from "fastify-oauth2";

import { sessionService } from "../../../../lib/db";
import { fetchDiscordUser } from "../../../helpers";

export default async (fastify: FastifyInstance) => {
  fastify.register(oauthPlugin, {
    name: "discordOAuth2",
    credentials: {
      client: {
        id: "372462428690055169",
        secret: "pJ0RL8O8KeOka2q4DCrvqnaJK6IGaW8Z",
      },
      auth: {
        authorizeHost: "https://discordapp.com",
        authorizePath: "/api/v6/oauth2/authorize",
        tokenHost: "https://discordapp.com",
        tokenPath: "/api/v6/oauth2/token",
      }
    },
    startRedirectPath: "/",
    callbackUri: "http://localhost/auth/discord/callback",
    scope: "guilds.join identify",
  });

  fastify.get("/callback", async function (request, response) {
    const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const user = await fetchDiscordUser(token.access_token);

    sessionService.saveOne({
      nonce: "urma",
      complete: true,
      discord: {
        id: user.id,
        ...token,
      },
    });

    response.redirect("/");
  });
};
