import { FastifyInstance } from "fastify";
// import oauthPlugin from "fastify-oauth2";
import { randomBytes } from "crypto";
import fetch from "node-fetch";
import querystring from "querystring";

// import { sessionService } from "../../../../lib/db";
// import { fetchDiscordUser, jwtSign } from "../../../helpers";
import tempApiTokenStore from "../../../tempApiTokenStore";

// const discordId = process.env.DISCORD_BOT_ID;
// const discordSecret = process.env.DISCORD_BOT_SECRET;
// const discordCallback = process.env.DISCORD_BOT_CALLBACK;

const kDiscordOauthUrl = "https://discordapp.com/api/v6/oauth2/token";

export default async (fastify: FastifyInstance) => {
  // fastify.register(oauthPlugin, {
  //   name: "discordOAuth2",
  //   credentials: {
  //     client: {
  //       id: discordId,
  //       secret: discordSecret,
  //     },
  //     auth: {
  //       authorizeHost: "https://discordapp.com",
  //       authorizePath: "/api/v6/oauth2/authorize",
  //       tokenHost: "https://discordapp.com",
  //       tokenPath: "/api/v6/oauth2/token",
  //     }
  //   },
  //   startRedirectPath: "/",
  //   callbackUri: discordCallback,
  //   scope: "guilds.join identify",
  // });

  // fastify.get("/callback", async function (request, response) {
  //   const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
  //   Reflect.deleteProperty(token, "iat");

  //   const user = await fetchDiscordUser(token.access_token);

  //   // For maxAge; use the discord expires_in date (provided in seconds)
  //   // and take an hour away just to be sure (discord doesnt document
  //   // how strict they are with this)
  //   response.setCookie("session", jwtSign({
  //     id: user.id,
  //     ...token
  //   }), {
  //     maxAge: token.expires_in - 60,
  //     httpOnly: true,
  //     sameSite: true,
  //     path: "/",
  //     // needs to be replaced by awesomo.feinwaru.com
  //     // allows for cookies to be shared between the api and frontend servers
  //     domain: "localhost"
  //   });

  //   const redirect = request.cookies.redirect;

  //   response.redirect(redirect == null ? "/" : `http://localhost:3000${redirect}`);
  // });

  fastify.post("/token", async (request, response) => {
    const { accessToken } = request.query;

    const existing = tempApiTokenStore.find(e => e.accessToken === accessToken);
    if (existing != null) {
      return {
        apiToken: existing.apiToken,
      };
    }

    let tokenRequest;

    try {
      // ############################## THIS RESPONSE NEEDS TO ACTUALLY BE SAVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const query = querystring.encode({
        client_id: process.env.DISCORD_BOT_ID,
        client_secret: process.env.DISCORD_BOT_SECRET,
        grant_type: "authorization_code",
        code: accessToken,
        redirect_uri: "http://localhost:3000/auth/discord/callback",
        scope: "guilds.join identify",
      });

      tokenRequest = await fetch(`${kDiscordOauthUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: query,
      });

      if (!tokenRequest.ok) {
        throw response.status;
      }
    } catch (error) {
      response.status(400);

      return {
        apiToken: null,
      };
    }

    const token = await tokenRequest.json();

    // TEMPORARY!!!
    const apiToken = randomBytes(20).toString("hex");
    tempApiTokenStore.push({
      apiToken,
      accessToken,
      token,
    });

    return {
      apiToken,
    };
  });
};
