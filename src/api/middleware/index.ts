import { FastifyRequest } from "fastify";

import { fetchSession } from "../helpers";
import { ISession } from "../../lib/db/types";

const requireDiscordAuth = async (request: FastifyRequest) => {
  // const accessToken = request.headers["xxx-access-token"];
  const session: any = await fetchSession(request.cookies.session);
  if (session == null /* && accessToken == null */) {
    throw new Error("session does not exist");
  }

  session.discord.
};

export {
  requireDiscordAuth,
};
