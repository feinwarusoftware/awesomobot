import { FastifyRequest, FastifyReply } from "fastify";

import { decodeSession, fetchDiscordUser } from "../helpers";
import tempApiTokenStore from "../tempApiTokenStore";

const verifyDiscordAuth = async function (request: FastifyRequest, reply: FastifyReply) {
  // On why this shouldnt redirect if the session doesnt exist or is invalid;
  // This is the api only, as so, the fetch requests will expect json responses.
  // In that case, a 403 response will suffice.

  // const jwt = request.headers["xxx-access-token"] || request.cookies.session;
  // if (jwt == null) {
  //   return reply
  //     .code(403)
  //     .send({
  //       success: false,
  //       error: "You are not authorised to access this path."
  //     });
  // }

  // const session = await decodeSession(jwt);

  // this.session = session;

  const apiToken = request.headers["xxx-access-token"] || request.cookies.apiToken;
  if (apiToken == null) {
    throw new Error("apiToken not specified on a protected route");
  }

  const { token } = tempApiTokenStore.find(e => e.apiToken === apiToken) ?? {};
  if (token == null) {
    throw new Error("bad apiToken");
  }

  console.log(token);

  this.session = token;
};

export {
  verifyDiscordAuth,
};
